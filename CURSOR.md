# 메인 페이지에 버튼 추가하기
_Exported on 7/31/2025 at 03:10:15 GMT+9 from Cursor (1.2.2)_

---

**User**

메인 페이지에 버튼을 하나 만들고 싶어

---

**Cursor**

메인 페이지에 버튼을 추가하기 위해 먼저 현재 프로젝트 구조를 확인하고 App.js 파일을 살펴보겠습니다.


현재 App.js 파일을 확인했습니다. 메인 페이지에 버튼을 추가하겠습니다. React Native의 `TouchableOpacity` 컴포넌트를 사용하여 버튼을 만들어보겠습니다.


```javascript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <TouchableOpacity style={styles.button} onPress={() => alert('버튼이 눌렸습니다!')}>
        <Text style={styles.buttonText}>클릭하세요</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

완료되었습니다! 메인 페이지에 버튼을 추가했습니다. 

추가된 기능:
- **TouchableOpacity** 컴포넌트를 import하여 버튼을 만들었습니다
- 버튼은 파란색 배경에 흰색 텍스트로 스타일링했습니다
- 버튼을 누르면 "버튼이 눌렸습니다!" 알림이 나타납니다
- 버튼은 기존 텍스트 아래에 위치하며, 적절한 여백을 두었습니다

버튼의 스타일:
- 파란색 배경 (`#007AFF`)
- 둥근 모서리 (8px)
- 적절한 패딩과 마진
- 흰색 텍스트와 굵은 폰트

앱을 실행하면 화면 중앙에 "클릭하세요" 버튼이 표시되고, 버튼을 누르면 알림이 나타납니다.

---

**User**

버튼 누르면 글을 입력하는 창이 뜨게 하고싶어

---

**Cursor**

버튼을 누르면 글을 입력하는 창이 뜨도록 수정하겠습니다. React Native의 `TextInput`과 `Modal`을 사용하여 구현하겠습니다.


```javascript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>글 입력하기</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>글을 입력하세요</Text>
            <TextInput
              style={styles.textInput}
              placeholder="여기에 글을 입력하세요..."
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
              numberOfLines={4}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={() => {
                  alert(`입력된 글: ${inputText}`);
                  setInputText('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>저장</Text>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
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
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
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
});
```

완료되었습니다! 이제 버튼을 누르면 글을 입력할 수 있는 모달 창이 뜹니다.

추가된 기능:

1. **모달 창**: 버튼을 누르면 화면 중앙에 모달이 나타납니다
2. **텍스트 입력**: 여러 줄 입력이 가능한 TextInput을 추가했습니다
3. **상태 관리**: `useState`를 사용하여 모달 표시 상태와 입력 텍스트를 관리합니다
4. **버튼들**: 
   - **취소 버튼**: 빨간색으로 모달을 닫습니다
   - **저장 버튼**: 초록색으로 입력된 텍스트를 확인하고 모달을 닫습니다

주요 특징:
- 모달은 반투명 배경으로 슬라이드 애니메이션과 함께 나타납니다
- 텍스트 입력창은 여러 줄 입력이 가능하며 최소 100px 높이를 가집니다
- 저장 버튼을 누르면 입력된 텍스트가 알림으로 표시됩니다
- 취소 버튼을 누르면 입력된 텍스트가 초기화됩니다

이제 "글 입력하기" 버튼을 누르면 글을 입력할 수 있는 창이 나타납니다!

---

**User**

저장하면 메인 화면에 목록으로 뜨게끔 하고싶어

---

**Cursor**

저장한 글들이 메인 화면에 목록으로 표시되도록 수정하겠습니다. `FlatList`를 사용하여 입력된 글들을 목록으로 보여주겠습니다.


```javascript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    if (inputText.trim()) {
      const newNote = {
        id: Date.now().toString(),
        text: inputText,
        date: new Date().toLocaleString()
      };
      setNotes([newNote, ...notes]);
      setInputText('');
      setModalVisible(false);
    }
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteText}>{item.text}</Text>
      <Text style={styles.noteDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>메모 목록</Text>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>새 메모 작성</Text>
      </TouchableOpacity>
      
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>아직 메모가 없습니다. 새 메모를 작성해보세요!</Text>
        }
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>새 메모 작성</Text>
            <TextInput
              style={styles.textInput}
              placeholder="여기에 메모를 입력하세요..."
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
              numberOfLines={4}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setInputText('');
                  setModalVisible(false);
                }}
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
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
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
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
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
  modalView: {
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
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
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
});
```

완료되었습니다! 이제 저장한 메모들이 메인 화면에 목록으로 표시됩니다.

주요 변경사항:

1. **메모 목록 기능**:
   - `FlatList`를 사용하여 메모들을 스크롤 가능한 목록으로 표시
   - 각 메모는 카드 형태로 표시되며 그림자 효과가 있습니다
   - 메모 텍스트와 작성 날짜가 표시됩니다

2. **상태 관리**:
   - `notes` 상태를 추가하여 메모 목록을 관리
   - `addNote` 함수로 새 메모를 목록 맨 위에 추가

3. **UI 개선**:
   - 메인 화면에 "메모 목록" 제목 추가
   - 버튼 텍스트를 "새 메모 작성"으로 변경
   - 메모가 없을 때 안내 메시지 표시
   - 전체적인 레이아웃을 메모 앱에 맞게 조정

4. **기능**:
   - 저장 버튼을 누르면 메모가 목록에 추가되고 모달이 닫힙니다
   - 취소 버튼을 누르면 입력 내용이 초기화됩니다
   - 최신 메모가 목록 맨 위에 표시됩니다

이제 "새 메모 작성" 버튼을 누르고 메모를 작성한 후 저장하면, 메인 화면에 메모 목록이 카드 형태로 표시됩니다!

---

**User**

지금은 메모 1줄만 있잖아
근데 이게 독서 필사 앱을 만들거야
그래서 메모 항목을 3개로 나누고 싶어
1. 책 이름
2. 저자
3. 문장

---

**Cursor**

독서 필사 앱으로 변경하여 메모 항목을 3개(책 이름, 저자, 문장)로 나누겠습니다.


```javascript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [sentence, setSentence] = useState('');
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    if (bookName.trim() && author.trim() && sentence.trim()) {
      const newNote = {
        id: Date.now().toString(),
        bookName: bookName,
        author: author,
        sentence: sentence,
        date: new Date().toLocaleString()
      };
      setNotes([newNote, ...notes]);
      setBookName('');
      setAuthor('');
      setSentence('');
      setModalVisible(false);
    }
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookName}>{item.bookName}</Text>
        <Text style={styles.author}>저자: {item.author}</Text>
      </View>
      <Text style={styles.sentence}>"{item.sentence}"</Text>
      <Text style={styles.noteDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>독서 필사</Text>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>새 필사 작성</Text>
      </TouchableOpacity>
      
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>아직 필사가 없습니다. 새 필사를 작성해보세요!</Text>
        }
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
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
            
            <Text style={styles.inputLabel}>인상 깊은 문장</Text>
            <TextInput
              style={[styles.textInput, styles.sentenceInput]}
              placeholder="인상 깊은 문장을 입력하세요"
              value={sentence}
              onChangeText={setSentence}
              multiline={true}
              numberOfLines={4}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setBookName('');
                  setAuthor('');
                  setSentence('');
                  setModalVisible(false);
                }}
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
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
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
  },
  bookInfo: {
    marginBottom: 10,
  },
  bookName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  sentence: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
    fontStyle: 'italic',
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
  modalView: {
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
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
});
```

완료되었습니다! 이제 독서 필사 앱으로 변경되었습니다.

주요 변경사항:

1. **입력 항목 3개로 분리**:
   - **책 이름**: 일반 텍스트 입력
   - **저자**: 일반 텍스트 입력  
   - **인상 깊은 문장**: 여러 줄 입력 가능

2. **UI 개선**:
   - 앱 제목을 "독서 필사"로 변경
   - 버튼 텍스트를 "새 필사 작성"으로 변경
   - 각 입력 필드에 라벨 추가
   - 모달 크기를 조정하여 3개 입력 필드에 맞게 확장

3. **목록 표시 개선**:
   - 책 이름을 굵은 글씨로 표시
   - 저자를 "저자: [이름]" 형태로 표시
   - 인상 깊은 문장을 따옴표로 감싸고 이탤릭체로 표시
   - 각 필사 항목이 카드 형태로 깔끔하게 정리

4. **기능**:
   - 모든 필드(책 이름, 저자, 문장)가 입력되어야 저장 가능
   - 취소 시 모든 입력 필드 초기화
   - 최신 필사가 목록 맨 위에 표시

이제 "새 필사 작성" 버튼을 누르면 책 이름, 저자, 인상 깊은 문장을 각각 입력할 수 있고, 저장하면 메인 화면에 독서 필사 목록으로 표시됩니다!

---

**User**

필사의 오른쪽 위에 휴지통 버튼을 만들어서, 누르면 삭제하게 하고싶어. 물론 삭제하기 전에 확인 모달 띄우고.

---

**Cursor**

필사 항목의 오른쪽 위에 휴지통 버튼을 추가하고, 삭제 전 확인 모달을 띄우는 기능을 구현하겠습니다.


```javascript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, Alert } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [sentence, setSentence] = useState('');
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    if (bookName.trim() && author.trim() && sentence.trim()) {
      const newNote = {
        id: Date.now().toString(),
        bookName: bookName,
        author: author,
        sentence: sentence,
        date: new Date().toLocaleString()
      };
      setNotes([newNote, ...notes]);
      setBookName('');
      setAuthor('');
      setSentence('');
      setModalVisible(false);
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
        <Text style={styles.author}>저자: {item.author}</Text>
      </View>
      <Text style={styles.sentence}>{item.sentence}</Text>
      <Text style={styles.noteDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>독서 필사</Text>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>새 필사 작성</Text>
      </TouchableOpacity>
      
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>아직 필사가 없습니다. 새 필사를 작성해보세요!</Text>
        }
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
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
            
            <Text style={styles.inputLabel}>인상 깊은 문장</Text>
            <TextInput
              style={[styles.textInput, styles.sentenceInput]}
              placeholder="인상 깊은 문장을 입력하세요"
              value={sentence}
              onChangeText={setSentence}
              multiline={true}
              numberOfLines={4}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setBookName('');
                  setAuthor('');
                  setSentence('');
                  setModalVisible(false);
                }}
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
        </View>
      </Modal>

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
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
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
  author: {
    fontSize: 14,
    color: '#666',
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
  modalView: {
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
    width: '90%',
    maxHeight: '80%',
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
    backgroundColor: '#FF3B30',
    flex: 0.45,
  },
});
```

완료되었습니다! 이제 각 필사 항목의 오른쪽 위에 휴지통 버튼이 추가되었고, 삭제 전 확인 모달이 표시됩니다.

주요 추가 기능:

1. **휴지통 버튼**:
   - 각 필사 카드의 오른쪽 위에 🗑️ 이모지로 표시
   - `position: 'absolute'`로 배치하여 다른 콘텐츠와 겹치지 않음

2. **삭제 확인 모달**:
   - 휴지통 버튼을 누르면 "필사 삭제" 확인 모달이 나타남
   - "이 필사를 삭제하시겠습니까?" 메시지 표시
   - "취소"와 "삭제" 버튼 제공

3. **삭제 기능**:
   - `deleteNote` 함수로 삭제할 항목의 ID를 저장
   - `confirmDelete` 함수로 실제 삭제 수행
   - 삭제 후 모달 닫기 및 상태 초기화

4. **UI 개선**:
   - 필사 카드의 텍스트에 `marginRight: 30`을 추가하여 휴지통 버튼과 겹치지 않도록 조정
   - 삭제 모달은 페이드 애니메이션으로 표시
   - 삭제 모달의 제목은 빨간색으로 표시하여 주의를 끌도록 함

이제 각 필사 항목의 오른쪽 위에 있는 휴지통 버튼을 누르면 확인 모달이 나타나고, "삭제"를 선택하면 해당 필사가 목록에서 제거됩니다!

