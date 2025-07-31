import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, Alert, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Animated, Dimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [page, setPage] = useState('');
  const [sentence, setSentence] = useState('');
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');
  
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

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
      toValue: Dimensions.get('window').height,
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
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
      <View style={styles.bookInfo}>
        <Text style={styles.bookName}>{item.bookName}</Text>
        <View style={styles.authorPageRow}>
          <Text style={styles.author}>저자: {item.author}</Text>
          <Text style={[styles.author, styles.page]}>페이지: {item.page}</Text>
        </View>
      </View>
      <Text style={styles.sentence}>{item.sentence}</Text>
      <Text style={styles.noteDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>새 필사 작성</Text>
      </TouchableOpacity>
      
      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText.trim() ? '검색 결과가 없습니다.' : '아직 필사가 없습니다. 새 필사를 작성해보세요!'}
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
            <View style={styles.slideHandle} />
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoidingView}
            >
              <ScrollView 
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>새 필사 작성</Text>
                  
                  <Text style={styles.inputLabel}>책 이름</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="책 이름을 입력하세요"
                    value={bookName}
                    onChangeText={setBookName}
                  />
                  
                  <Text style={styles.inputLabel}>저자</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="저자를 입력하세요"
                    value={author}
                    onChangeText={setAuthor}
                  />
                  
                  <Text style={styles.inputLabel}>페이지</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="페이지를 입력하세요"
                    value={page}
                    onChangeText={setPage}
                    keyboardType="numeric"
                  />
                  
                  <Text style={styles.inputLabel}>인상깊은 문장</Text>
                  <TextInput
                    style={[styles.textInput, styles.sentenceInput]}
                    placeholder="인상깊은 문장을 입력하세요"
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
                      <Text style={styles.buttonText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonSave]}
                      onPress={addNote}
                    >
                      <Text style={styles.buttonText}>저장</Text>
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
            <Text style={styles.deleteModalTitle}>필사 삭제</Text>
            <Text style={styles.deleteModalText}>이 필사를 삭제하시겠습니까?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonDelete]}
                onPress={confirmDelete}
              >
                <Text style={styles.buttonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 70,
    paddingHorizontal: 20,
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#a6969f',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'center',
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
  },
  deleteButtonText: {
    fontSize: 20,
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
    margin: 20,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    width: '90%',
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
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 15,
    fontSize: 16,
  },
  sentenceInput: {
    minHeight: 100,
    textAlignVertical: 'top',
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '50%',
  },
  slideHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});
