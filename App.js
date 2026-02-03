import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('READY');

  const handleSend = async () => {
    if (!input) return;
    setStatus('THINKING...');
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:8080/completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, n_predict: 512 })
      });
      const data = await response.json();
      setMessages([...newMessages, { role: 'ai', text: data.content }]);
      setStatus('READY');
    } catch (error) {
      setMessages([...newMessages, { role: 'ai', text: 'SERVER ERROR: Check Termux.' }]);
      setStatus('OFFLINE');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SYSTEM_AI_v1</Text>
        <Text style={[styles.status, {color: status === 'READY' ? '#00ff00' : '#ff0000'}]}>{status}</Text>
      </View>
      
      <ScrollView style={styles.msgArea}>
        {messages.map((m, i) => (
          <View key={i} style={m.role === 'user' ? styles.userBox : styles.aiBox}>
            <Text style={styles.label}>{m.role.toUpperCase()}</Text>
            <Text style={styles.msgText}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Enter command..."
          placeholderTextColor="#666"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>EXE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#333', pb: 10, mb: 10 },
  headerText: { color: '#00ff00', fontWeight: 'bold', fontSize: 18 },
  status: { fontSize: 12, fontWeight: 'bold' },
  msgArea: { flex: 1 },
  userBox: { alignSelf: 'flex-end', backgroundColor: '#1a1a1a', padding: 10, borderRadius: 10, mb: 10, maxWidth: '80%' },
  aiBox: { alignSelf: 'flex-start', borderLeftWidth: 2, borderLeftColor: '#00ff00', padding: 10, mb: 10, maxWidth: '90%' },
  label: { color: '#555', fontSize: 10, marginBottom: 4 },
  msgText: { color: '#fff', fontSize: 16 },
  inputContainer: { flexDirection: 'row', gap: 10, paddingTop: 10 },
  input: { flex: 1, backgroundColor: '#111', color: '#00ff00', padding: 15, borderRadius: 5, borderWidth: 1, borderColor: '#333' },
  sendBtn: { backgroundColor: '#00ff00', justifyContent: 'center', paddingHorizontal: 20, borderRadius: 5 },
  sendBtnText: { color: '#000', fontWeight: 'bold' }
});
