import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { Server } from "miragejs";

if (window.server) {
  server.shutdown();
}

window.server = new Server({
  routes() {
    this.get("/api/users", () => {
      return [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
      ];
    });
  }
});

const App = () => {
  let [users, setUsers] = useState([]);
  let [serverError, setServerError] = useState();

  useEffect(() => {
    let fetchUsers = async () => {
      try {
        let res = await fetch("/api/users");
        let users = await res.json();
        setUsers(users);
      } catch (error) {
        setServerError(error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {serverError ? (
        <Text testID="server-error">{serverError}</Text>
      ) : users.length === 0 ? (
        <Text testID="no-users">No users!</Text>
      ) : (
        users.map(user => (
          <View key={user.id} testID="users">
            <Text testID={`user-${user.id}`}>{user.name}</Text>
          </View>
        ))
      )}
    </SafeAreaView>
  );
};

export default App;
