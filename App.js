import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, Alert, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Animated, Dimensions, Image, Switch } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const initialLayout = { width: Dimensions.get('window').width };

// 알림 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Library screen component
function LibraryScreen() {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.placeholderContent}>
        <Text style={styles.placeholderText}>Library feature is coming soon.</Text>
      </View>
    </View>
  );
}

// 필사 화면 컴포넌트
function NotesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [page, setPage] = useState('');
  const [sentence, setSentence] = useState('');
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
  
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').height)).current;

  // 랜덤 인용구 선택 함수
  const getRandomQuote = () => {
    if (notes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
  };

  // 랜덤 인용구 푸시 알림
  const sendRandomQuoteNotification = async () => {
    const randomQuote = getRandomQuote();
    if (!randomQuote) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `"${randomQuote.bookName}"`,
        body: `"${randomQuote.sentence}" - ${randomQuote.author}`,
        data: { 
          type: 'random_quote',
          quoteId: randomQuote.id 
        },
      },
      trigger: null, // 즉시 발송
    });
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: -Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setBookName('');
      setAuthor('');
      setPage('');
      setSentence('');
    });
  };

  // 검색된 필사 필터링
  const filteredNotes = notes.filter(note => {
    if (!searchText.trim()) return true;
    
    const searchLower = searchText.toLowerCase();
    return (
      note.bookName.toLowerCase().includes(searchLower) ||
      note.author.toLowerCase().includes(searchLower) ||
      note.sentence.toLowerCase().includes(searchLower)
    );
  });

  const addNote = () => {
    if (bookName.trim() && author.trim() && sentence.trim()) {
      const newNote = {
        id: Date.now().toString(),
        bookName: bookName,
        author: author,
        page: page,
        sentence: sentence,
        date: new Date().toLocaleString()
      };
      setNotes([newNote, ...notes]);
      closeModal();
    }
  };

  const deleteNote = (id) => {
    setSelectedNoteId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    setNotes(notes.filter(note => note.id !== selectedNoteId));
    setDeleteModalVisible(false);
    setSelectedNoteId(null);
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteNote(item.id)}
      >
        <Image 
          source={require('./assets/free-icon-recycle-bin.png')}
          style={styles.deleteButtonImage}
        />
      </TouchableOpacity>
      <View style={styles.bookInfo}>
        <Text style={styles.bookName}>{item.bookName}</Text>
        <View style={styles.authorPageRow}>
                  <Text style={styles.author}>Author: {item.author}</Text>
        <Text style={[styles.author, styles.page]}>Page: {item.page}</Text>
        </View>
      </View>
      <Text style={styles.sentence}>{item.sentence}</Text>
      <Text style={styles.noteDate}>{item.date}</Text>
    </View>
  );

  const renderCard = ({ item }) => (
    <View style={styles.cardItem}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardBookName}>{item.bookName}</Text>
        <TouchableOpacity 
          style={styles.cardDeleteButton}
          onPress={() => deleteNote(item.id)}
        >
          <Image 
            source={require('./assets/free-icon-recycle-bin.png')}
            style={styles.cardDeleteButtonImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.cardAuthorInfo}>
        <Text style={styles.cardAuthor}>{item.author}</Text>
        <Text style={styles.cardPage}>Page: {item.page}</Text>
      </View>
      <Text style={styles.cardSentence}>{item.sentence}</Text>
      <Text style={styles.cardDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter search term"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={openModal}>
          <Text style={styles.buttonText}>Write New Quote</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewToggleButton} onPress={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}>
          <Text style={styles.viewToggleText}>{viewMode === 'list' ? '📋' : '📄'}</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        key={viewMode}
        data={filteredNotes}
        renderItem={viewMode === 'list' ? renderNote : renderCard}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        numColumns={viewMode === 'card' ? 2 : 1}
        columnWrapperStyle={viewMode === 'card' ? styles.cardRow : null}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText.trim() ? 'No search results found.' : 'No quotes yet. Write your first quote!'}
          </Text>
        }
      />
      
      {modalVisible && (
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.overlayBackground} />
          </TouchableWithoutFeedback>
          <Animated.View 
            style={[
              styles.slideView,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.slideHandle} />
            </View>
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoidingView}
            >
              <ScrollView 
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalView}>                  
                  <Text style={styles.inputLabel}>Book Title</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter book title"
                    value={bookName}
                    onChangeText={setBookName}
                  />
                  
                  <Text style={styles.inputLabel}>Author</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter author name"
                    value={author}
                    onChangeText={setAuthor}
                  />
                  
                  <Text style={styles.inputLabel}>Page</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter page number"
                    value={page}
                    onChangeText={setPage}
                    keyboardType="numeric"
                  />
                  
                  <Text style={styles.inputLabel}>Impressive Sentence</Text>
                  <TextInput
                    style={[styles.textInput, styles.sentenceInput]}
                    placeholder="Enter the impressive sentence"
                    value={sentence}
                    onChangeText={setSentence}
                    multiline={true}
                    numberOfLines={4}
                  />
                  
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={closeModal}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonSave]}
                      onPress={addNote}
                    >
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.deleteModalView}>
            <Text style={styles.deleteModalTitle}>Delete Quote</Text>
            <Text style={styles.deleteModalText}>Are you sure you want to delete this quote?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonDelete]}
                onPress={confirmDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 설정 화면 컴포넌트
function SettingsScreen() {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert('알림 권한이 필요합니다', '설정에서 알림을 허용해주세요.');
        return false;
      }
      
      return true;
    }
    
    Alert.alert('실제 기기에서만 알림이 작동합니다');
    return false;
  };

  // 알림 스케줄링
  const scheduleNotification = async () => {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    // 기존 알림 취소
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (notificationEnabled) {
      const [hour, minute] = notificationTime.split(':').map(Number);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "오늘의 인용구",
          body: "새로운 인용구를 확인해보세요!",
          data: { type: 'daily_quote' },
        },
        trigger: {
          hour: hour,
          minute: minute,
          repeats: true,
        },
      });
    }
  };

  // 알림 토글
  const toggleNotification = async (value) => {
    setNotificationEnabled(value);
    if (value) {
      await scheduleNotification();
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>일일 인용구 알림</Text>
          <Switch
            value={notificationEnabled}
            onValueChange={toggleNotification}
            trackColor={{ false: '#767577', true: '#a6969f' }}
            thumbColor={notificationEnabled ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        
        {notificationEnabled && (
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>알림 시간</Text>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setTimeModalVisible(true)}
            >
              <Text style={styles.timeText}>{notificationTime}</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <Modal
          visible={timeModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setTimeModalVisible(false)}
        >
          <View style={styles.timeModalOverlay}>
            <View style={styles.timeModalContent}>
              <Text style={styles.timeModalTitle}>알림 시간 설정</Text>
              
              <View style={styles.timePickerContainer}>
                <View style={styles.timePickerColumn}>
                  <Text style={styles.timePickerLabel}>시간</Text>
                  <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({length: 24}, (_, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.timePickerItem,
                          selectedHour === i && styles.timePickerItemSelected
                        ]}
                        onPress={() => setSelectedHour(i)}
                      >
                        <Text style={[
                          styles.timePickerItemText,
                          selectedHour === i && styles.timePickerItemTextSelected
                        ]}>
                          {i.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <Text style={styles.timePickerSeparator}>:</Text>
                
                <View style={styles.timePickerColumn}>
                  <Text style={styles.timePickerLabel}>분</Text>
                  <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({length: 60}, (_, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.timePickerItem,
                          selectedMinute === i && styles.timePickerItemSelected
                        ]}
                        onPress={() => setSelectedMinute(i)}
                      >
                        <Text style={[
                          styles.timePickerItemText,
                          selectedMinute === i && styles.timePickerItemTextSelected
                        ]}>
                          {i.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              
              <View style={styles.timeModalButtons}>
                <TouchableOpacity
                  style={[styles.timeModalButton, styles.timeModalButtonCancel]}
                  onPress={() => setTimeModalVisible(false)}
                >
                  <Text style={styles.timeModalButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.timeModalButton, styles.timeModalButtonSave]}
                  onPress={() => {
                    const newTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
                    setNotificationTime(newTime);
                    setTimeModalVisible(false);
                    // 알림 스케줄 업데이트
                    scheduleNotification();
                  }}
                >
                  <Text style={styles.timeModalButtonText}>저장</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>앱 정보</Text>
          <Text style={styles.settingDescription}>Inquoter v1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [index, setIndex] = useState(1); // 필사 탭을 기본으로 설정
  const [routes] = useState([
    { key: 'library', title: 'Library', icon: '' },
    { key: 'notes', title: 'Quotes', icon: '' },
    { key: 'settings', title: 'Settings', icon: '' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'library':
        return <LibraryScreen />;
      case 'notes':
        return <NotesScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={() => null}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          swipeEnabled={true}
        />
      </View>
      <View style={styles.bottomTabBar}>
        {routes.map((route, routeIndex) => (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, index === routeIndex && styles.activeTabItem]}
            onPress={() => setIndex(routeIndex)}
          >
            <Text style={[styles.tabLabel, index === routeIndex && styles.activeTabLabel]}>
              {route.icon} {route.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  screenDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  settingsContainer: {
    flex: 1,
    paddingTop: 20,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 16,
    color: '#666',
  },
  timeButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  timeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 350,
  },
  timeModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  timePickerColumn: {
    alignItems: 'center',
    flex: 1,
  },
  timePickerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timePickerScroll: {
    height: 120,
    width: 80,
  },
  timePickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  timePickerItemSelected: {
    backgroundColor: '#a6969f',
  },
  timePickerItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  timePickerItemTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timePickerSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
  },
  timeModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  timeModalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  timeModalButtonSave: {
    backgroundColor: '#a6969f',
  },
  timeModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 48,
    textAlignVertical: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#a6969f',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  viewToggleButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 4,
  },
  viewToggleText: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  noteItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  deleteButtonImage: {
    width: 20,
    height: 20,
    tintColor: '#FF3B30',
  },
  bookInfo: {
    marginBottom: 10,
    marginRight: 30,
  },
  bookName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  authorPageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  sentence: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
    fontStyle: 'italic',
    marginRight: 30,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  cardRow: {
    justifyContent: 'space-between',
  },
  cardItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    // marginHorizontal: 4,
    // flex: 1,
    width: '48.5%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardBookName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  cardDeleteButton: {
    padding: 4,
  },
  cardDeleteButtonImage: {
    width: 16,
    height: 16,
    tintColor: '#ff6b6b',
  },
  cardAuthorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardAuthor: {
    fontSize: 12,
    color: '#666',
  },
  cardPage: {
    fontSize: 12,
    color: '#666',
  },
  cardSentence: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
    marginTop: 'auto',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    width: '95%',
  },
  deleteModalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FF3B30',
  },
  deleteModalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 15,
    fontSize: 16,
    height: 48,
    textAlignVertical: 'center',
    backgroundColor: '#f8f8f8',
  },
  sentenceInput: {
    minHeight: 100,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f8f8f8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonClose: {
    backgroundColor: '#FF3B30',
    flex: 0.45,
  },
  buttonSave: {
    backgroundColor: '#34C759',
    flex: 0.45,
  },
  buttonDelete: {
    backgroundColor: '#8E8E93',
    flex: 0.45,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  slideView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  slideHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  contentContainer: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTabItem: {
    borderTopWidth: 2,
    borderTopColor: '#a6969f',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabLabel: {
    color: '#a6969f',
    fontWeight: '600',
  },
});
