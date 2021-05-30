import React from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
// import{Listitems}from"react-native-element"
import * as firebase from 'firebase';
import db from '../config';
export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alltransactionlists: [],
      lastTransction: null,
      search: '',
    };
  }
  fetchMoreTranscation = async () => {
    var text = this.state.search.toUpperCase();
    var enterText = text.split('');

    if (enterText[0].toUpperCase() === 'B') {
      const transction = await db
        .collection('transastion')
        .where('book_id', '==', text)
        .startAfter(this.state.lastTransction)
        .limit(6)
        .get();
      transction.docs.map((doc) => {
        this.setState({
          alltransactionlists: [...this.state.alltransactionlists, doc.data()],
          lastTransction: doc,
        });
      });
    } else if (enterText[0].toUpperCase() === 'S') {
      const transction = await db
        .collection('transastion')
        .where('student_id', '==', text)
        .startAfter(this.state.lastTransction)
        .limit(6)
        .get();

      transction.docs.map((doc) => {
        this.setState({
          alltransactionlists: [...this.state.alltransactionlists, doc.data()],
          lastTransction: doc,
        });
      });
    }
  };

  searchTransction = async (text) => {
    var enterText = text.split('');

    if (enterText[0].toUpperCase() === 'B') {
      const transction = await db
        .collection('transastion')
        .where('book_id', '==', text)
        .get();
      transction.docs.map((doc) => {
        this.setState({
          alltransactionlists: [...this.state.alltransactionlists, doc.data()],
          lastTransction: doc,
        });
      });
    } else if (enterText[0].toUpperCase() === 'S') {
      const transction = await db
        .collection('transastion')
        .where('student_id', '==', text)
        .get();
      transction.docs.map((doc) => {
        this.setState({
          alltransactionlists: [...this.state.alltransactionlists, doc.data()],
          lastTransction: doc,
        });
      });
    }
  };
  componentDidMount = async () => {
    const transactiondata = await db.collection('transastion').limit(6).get();
    console.log(transactiondata);
    transactiondata.docs.map((doc) => {
      this.setState({
        alltransactionlists: [],
        lastTransction: doc,
      });
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.bar}
            placeholder="Enter Book Id or Student Id"
            onChangeText={(text) => {
              this.setState({ search: text });
            }}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              this.searchTransction(this.state.search);
             
            }}>
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.alltransactionlists}
          renderItem={({ item }) => (
            <View style={{ borderBottomWidth: 3 }}>
              <Text>{'bookId: ' + item.book_id}</Text>
              <Text>{'studentId: ' + item.student_id}</Text>
              <Text>{'transactiontype: ' + item.transastion_type}</Text>
              <Text>{'date: ' + item.date.toDate()}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.fetchMoreTranscation}
          onEndReachedThreshold={0.7}></FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  searchBar: {
    flexDirection: 'row',
    height: 40,
    width: 'auto',
    borderWidth: 0.5,
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  bar: {
    borderWidth: 2,
    height: 30,
    width: 300,
    paddingLeft: 10,
  },
  searchButton: {
    borderWidth: 1,
    height: 30,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
});
