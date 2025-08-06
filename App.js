import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, Alert, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Animated, Dimensions, Image, Switch, ActionSheetIOS } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabView, TabBar } from 'react-native-tab-view';
import { useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Font from 'expo-font';

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
        <Text style={styles.placeholderText}>Library feature coming soon.</Text>
      </View>
    </View>
  );
}

// 필사 화면 컴포넌트
function QuotesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [page, setPage] = useState('');
  const [sentence, setSentence] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').height)).current;
  
  // 편집 모달 상태 (완전히 독립적)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editBookName, setEditBookName] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editPage, setEditPage] = useState('');
  const [editSentence, setEditSentence] = useState('');
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  // 저장된 인용구 불러오기
  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const savedQuotes = await AsyncStorage.getItem('quotes');
      if (savedQuotes) {
        setQuotes(JSON.parse(savedQuotes));
        console.log('Loaded quotes:', JSON.parse(savedQuotes).length);
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
    }
  };

  const saveQuotes = async (newQuotes) => {
    try {
      await AsyncStorage.setItem('quotes', JSON.stringify(newQuotes));
      console.log('Saved quotes:', newQuotes.length);
    } catch (error) {
      console.error('Error saving quotes:', error);
    }
  };

  // 랜덤 인용구 선택 함수
  const getRandomQuote = () => {
    if (quotes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
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
    setBookName('');
    setAuthor('');
    setPage('');
    setSentence('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setBookName('');
    setAuthor('');
    setPage('');
    setSentence('');
  };

  const openEditModal = (quote) => {
    setEditBookName(quote.bookName);
    setEditAuthor(quote.author);
    setEditPage(quote.page);
    setEditSentence(quote.sentence);
    setEditingQuoteId(quote.id);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditBookName('');
    setEditAuthor('');
    setEditPage('');
    setEditSentence('');
    setEditingQuoteId(null);
  };

  // 검색된 필사 필터링
  const filteredQuotes = quotes.filter(quote => {
    if (!searchText.trim()) return true;
    
    const searchLower = searchText.toLowerCase();
    return (
      quote.bookName.toLowerCase().includes(searchLower) ||
      quote.author.toLowerCase().includes(searchLower) ||
      quote.sentence.toLowerCase().includes(searchLower)
    );
  });

  const addQuote = async () => {
    console.log('addQuote called');
    console.log('sentence:', sentence);
    console.log('bookName:', bookName);
    console.log('author:', author);
    console.log('page:', page);
    
    if (!sentence.trim()) {
      Alert.alert('Input Error', 'Please enter a quote.');
      return;
    }
    
    const newQuote = {
      id: Date.now().toString(),
      bookName: bookName.trim() || 'No Title',
      author: author.trim() || 'No Author',
      page: page.trim() || '',
      sentence: sentence.trim(),
      date: new Date().toLocaleString()
    };
    
    console.log('newQuote:', newQuote);
    const updatedQuotes = [newQuote, ...quotes];
    setQuotes(updatedQuotes);
    await saveQuotes(updatedQuotes);
    console.log('quotes updated and saved, count:', updatedQuotes.length);
    closeModal();
  };

  const updateQuote = async () => {
    console.log('updateQuote called');
    console.log('editSentence:', editSentence);
    console.log('editBookName:', editBookName);
    console.log('editAuthor:', editAuthor);
    console.log('editPage:', editPage);
    
    if (!editSentence.trim()) {
      Alert.alert('Input Error', 'Please enter a quote.');
      return;
    }
    
    // 기존 인용구 업데이트
    const updatedQuotes = quotes.map(quote => 
      quote.id === editingQuoteId 
        ? {
            ...quote,
            bookName: editBookName.trim() || 'No Title',
            author: editAuthor.trim() || 'No Author',
            page: editPage.trim() || '',
            sentence: editSentence.trim(),
            date: new Date().toLocaleString()
          }
        : quote
    );
    setQuotes(updatedQuotes);
    await saveQuotes(updatedQuotes);
    console.log('quote updated and saved');
    closeEditModal();
  };

  const deleteQuote = (id) => {
    Alert.alert(
      'Delete Quote',
      'Are you sure you want to delete this quote?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedQuotes = quotes.filter(quote => quote.id !== id);
            setQuotes(updatedQuotes);
            await saveQuotes(updatedQuotes);
          },
        },
      ]
    );
  };

  const showActionSheet = (quote) => {
    if (Platform.OS === 'ios') {
      // 햅틱 피드백 추가
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // 액션 시트 표시
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Edit', 'Delete', 'Cancel'],
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
        },
                  (buttonIndex) => {
            if (buttonIndex === 0) {
              console.log('편집 선택됨');
              // 편집 선택 시 햅틱 피드백
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              openEditModal(quote);
            } else if (buttonIndex === 1) {
              console.log('삭제 선택됨');
              // 삭제 선택 시 햅틱 피드백
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              deleteQuote(quote.id);
            }
          }
      );
    } else {
      // Alert.alert('편집');
      // iOS 이외의 플랫폼에는 일단 대응하지 않음
    }
  };

  const renderList = ({ item }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onLongPress={() => showActionSheet(item)}
      delayLongPress={500}
    >
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteQuote(item.id)}
      >
        <Image 
          source={require('./assets/free-icon-recycle-bin.png')}
          style={styles.deleteButtonImage}
        />
      </TouchableOpacity>
      <View style={styles.listBookInfo}>
        <Text style={styles.listBookName}>{item.bookName}</Text>
        <Text style={styles.listAuthor}>{item.author}</Text>
      </View>
      <Text style={styles.listSentence}>{item.sentence}</Text>
      <View style={styles.listBottomRow}>
        <Text style={styles.listPage}>P.{item.page}</Text>
        <Text style={styles.listDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardItem}
      onLongPress={() => showActionSheet(item)}
      delayLongPress={500}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardBookName}>{item.bookName}</Text>
        <TouchableOpacity 
          style={styles.cardDeleteButton}
          onPress={() => deleteQuote(item.id)}
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
    </TouchableOpacity>
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
        {/* TODO: 표시 모드 추가 */}
        {/* <TouchableOpacity style={styles.viewToggleButton} onPress={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}>
          <Text style={styles.viewToggleText}>{viewMode === 'list' ? '📋' : '📄'}</Text>
        </TouchableOpacity> */}
      </View>
      
      <FlatList
        key={viewMode}
        data={filteredQuotes}
        renderItem={viewMode === 'list' ? renderList : renderCard}
        keyExtractor={item => item.id}
        style={styles.flatList}
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
        <Modal
          animationType="fade"
          transparent={false}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.fullScreenModal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addQuote}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalView}>
              <Text style={styles.inputLabel}>
                Book Title <Text style={styles.optionalText}>(Optional)</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter book title"
                value={bookName}
                onChangeText={setBookName}
                autoFocus={true}
              />
              
              <Text style={styles.inputLabel}>
                Author <Text style={styles.optionalText}>(Optional)</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter author name"
                value={author}
                onChangeText={setAuthor}
              />
              
              <Text style={styles.inputLabel}>
                Page <Text style={styles.optionalText}>(Optional)</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter page number"
                value={page}
                onChangeText={setPage}
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>
                Quote <Text style={styles.requiredText}>(Required)</Text>
              </Text>
              <TextInput
                style={[styles.textInput, styles.sentenceInput]}
                placeholder="Enter your quote"
                value={sentence}
                onChangeText={setSentence}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* 편집 모달 */}
      {editModalVisible && (
        <Modal
          animationType="fade"
          transparent={false}
          visible={editModalVisible}
          onRequestClose={closeEditModal}
        >
          <View style={styles.fullScreenModal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={closeEditModal}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={updateQuote}>
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalView}>                  
              <Text style={styles.inputLabel}>
                Book Title <Text style={styles.optionalText}>(Optional)</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter book title"
                value={editBookName}
                onChangeText={setEditBookName}
                autoFocus={true}
              />
              
              <Text style={styles.inputLabel}>
                Author <Text style={styles.optionalText}>(Optional)</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter author name"
                value={editAuthor}
                onChangeText={setEditAuthor}
              />
              
              <Text style={styles.inputLabel}>
                Page <Text style={styles.optionalText}>(Optional)</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter page number"
                value={editPage}
                onChangeText={setEditPage}
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>
                Quote <Text style={styles.optionalText}>(Required)</Text>
              </Text>
              <TextInput
                style={[styles.textInput, styles.sentenceInput]}
                placeholder="Enter your quote"
                value={editSentence}
                onChangeText={setEditSentence}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>
        </Modal>
      )}
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
        Alert.alert('Notification Permission Required', 'Please allow notifications in settings.');
        return false;
      }
      
      return true;
    }
    
    Alert.alert('Notifications only work on physical devices');
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
                  title: "Today's Quote",
        body: "Check out a new quote!",
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
        {/* TODO: 알림 기능 추가 */}
        {/* <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Daily Quote Notifications</Text>
          <Switch
            value={notificationEnabled}
            onValueChange={toggleNotification}
            trackColor={{ false: '#767577', true: '#a6969f' }}
            thumbColor={notificationEnabled ? '#f4f3f4' : '#f4f3f4'}
          />
        </View> */}
        
        {/* TODO: 알림 기능 추가 */}
        {/* {notificationEnabled && (
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notification Time</Text>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setTimeModalVisible(true)}
            >
              <Text style={styles.timeText}>{notificationTime}</Text>
            </TouchableOpacity>
          </View>
        )} */}
        
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
          <Text style={styles.settingLabel}>App Version</Text>
          <Text style={styles.settingDescription}>1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [index, setIndex] = useState(1); // Quotes tab as default
  const [routes] = useState([
    { key: 'library', title: 'Library', icon: '' },
    { key: 'quotes', title: 'Quotes', icon: '' },
    { key: 'settings', title: 'Settings', icon: '' },
  ]);

  // 폰트 로딩
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'NanumMyeongjo': require('./assets/font/NanumMyeongjo-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'library':
        return <LibraryScreen />;
      case 'quotes':
        return <QuotesScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  };



  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
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
  flatList: {
    flex: 1,
  },
  listItem: {
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
  listBookInfo: {
    marginBottom: 10,
    marginRight: 30,
  },
  listBookName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  listAuthorPageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listAuthor: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  listSentence: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
    marginRight: 30,
    fontFamily: 'NanumMyeongjo',
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
    paddingLeft: 12,
  },
  listDate: {
    fontSize: 12,
    color: '#999',
  },
  listBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  listPage: {
    fontSize: 12,
    color: '#666',
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
    fontFamily: 'NanumMyeongjo',
    borderLeftWidth: 3,
    borderLeftColor: '#ccc',
    paddingLeft: 10,
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
    paddingHorizontal: 20,
    alignItems: 'center',
    // width: '100%',
    
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
  optionalText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999',
  },
  requiredText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  textInput: {
    // borderWidth: 1,
    // borderColor: '#f8f8f8',
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
    height: 170,
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
  fullScreenModal: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    // paddingBottom: 20,
    backgroundColor: '#fff',
    // marginHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#a6969f',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  updateButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
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
