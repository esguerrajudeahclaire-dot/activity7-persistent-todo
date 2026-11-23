
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim() === '') {
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: task
    };

    setTasks([...tasks, newTask]);
    setTask('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My To-Do List</Text>
      <Text style={styles.subtitle}>Manage your daily tasks</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task..."
          value={task}
          onChangeText={setTask}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#344B3A',
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
  },
  addButton: {
    backgroundColor: '#344B3A',
    padding: 15,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
});
