import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedbackBase, Image, TextInput, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import db from "../config"
import firebase from "firebase"

export default class Transastion extends React.Component {
  constructor() {
    super()
    this.state = {
      askCameraPermition: null,
      scan: false,
      scanData: "",
      buttonStatus: "normal",
      scanBookId: "",
      scanStudentId: ""
    }
  }
  getCameraPermition = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      askCameraPermition: status === 'granted',
      scan: false,
      scanData: "",
      buttonStatus: id,

    })
  }
  handleBarcode = async ({ data }) => {
    if (this.state.buttonStatus == "bookid") {
      this.setState({
        scan: true,
        scanBookId: data,
        buttonStatus: "normal"
      }
      )
    }
    else if (this.state.buttonStatus == "studentid") {
      this.setState({
        scan: true,
        scanStudentId: data,
        buttonStatus: "normal"
      }
      )
    }
  }


  initiatebook = async () => {
    db.collection("transastion").add({
      book_id: this.state.scanBookId,
      student_id: this.state.scanStudentId,
      transastion_type: "issued",
      date: firebase.firestore.Timestamp.now().toDate()
    })
    const book_ref = db.collection("books")
    book_ref.where("bookid", '==', this.state.scanBookId).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        book_ref.doc(doc.id).update({ bookavailability: false })
      })
    })
    //db.collection("students").doc(this.state.scanStudentId).update({ 'noofbooksissued' : firebase.firestore.FieldValue.increment(+1) })
    const student_ref = db.collection("students")
    student_ref.where("studentid", "==", this.state.scanStudentId).get().then((snapshot) => {
      console.log(student_ref)
      snapshot.forEach((doc) => {
        student_ref.doc(doc.id).update({ noofbooksissued: firebase.firestore.FieldValue.increment(+1) })
      })
    })
  }
  returnbook = async () => {
    db.collection("transastion").add({
      book_id: this.state.scanBookId,
      student_id: this.state.scanStudentId,
      transastion_type: "returned",
      date: firebase.firestore.Timestamp.now().toDate()
    })
    const book_ref = db.collection("books")
    book_ref.where("bookid", '==', this.state.scanBookId).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        book_ref.doc(doc.id).update({ bookavailability: true })
      })
    })

    //db.collection("students").doc(this.state.scanStudentId).update({ 'noofbooksissued' : firebase.firestore.FieldValue.increment(-1) })
    const student_ref = db.collection("students")
    console.log(this.state.scanStudentId)
    student_ref.where("studentid", "==", this.state.scanStudentId).get().then((snapshot) => {
      console.log(student_ref)
      snapshot.forEach((doc) => {

        student_ref.doc(doc.id).update({ noofbooksissued: firebase.firestore.FieldValue.increment(-1) })
      })
    })
  }



  checkBookEligbility = async () => {
    const book_eligible = await db.collection("books").where("bookid", "==", this.state.scanBookId).get()
    var trascationType = ""
    if (book_eligible.docs.length === 0) {
      trascationType = false;
    }
    else {
      book_eligible.docs.map((doc) => {
        var book = doc.data()
        if (book.bookavailability) {
          trascationType = "Issue"
        }
        else {
          trascationType = "Return"
        }
      })
    }
    return trascationType
  }


  checkStudentEligbilityForIssue = async () => {
    const student_ref = await db.collection("students").where("studentid", "==", this.state.scanStudentId).get()
    var isStudentEligble = ""
    if (student_ref.docs.length === 0) {
      this.setState({
        scanBookId: "",
        scanStudentId: ""
      })
      isStudentEligble = false
      Alert.alert("The StudentId doesnt exist in database")
    }
    else {
      student_ref.docs.map((doc) => {
        var student = doc.data()
        if (student.noofbooksissued < 2) {
          isStudentEligble = true
        }
        else {
          isStudentEligble = false
          Alert.alert("The student already issued 2 books")
          this.setState({
            scanBookId: "",
            scanStudentId: ""
          })
        }
      })
    }

    return isStudentEligble
  }

  checkStudentEligbilityForReturn = async () => {
    var transastion_ref = await db.collection("transastion").where("book_id", "==", this.state.scanBookId)
      .get()

    var isStudentEligble = ""
    transastion_ref.docs.map((doc) => {
      var lastTransction = doc.data()
      if (lastTransction.student_id === this.state.scanStudentId) {
        isStudentEligble = true
      }
      else {
        isStudentEligble = false
        Alert.alert("the book not issued by this student")
        this.setState({
          scanBookId: "",
          scanStudentId: ""
        })
      }
    })
    return isStudentEligble
  }

  handleTransation = async () => {
    var trascationType = await this.checkBookEligbility()
    console.log(trascationType)
    if (!trascationType) {
      Alert.alert("The book doesnt exist in database")
      this.setState({
        scanBookId: "",
        scanStudentId: ""
      })
    }
    else if (trascationType === "Issue") {
      var isStudentEligble = await this.checkStudentEligbilityForIssue()
      if (isStudentEligble) {
        this.initiatebook()
        Alert.alert("book issue to the student")
      }
    }
    else {
      var isStudentEligble = await this.checkStudentEligbilityForReturn()
      if (isStudentEligble) {
        this.returnbook()
        Alert.alert("book returned to the library")
      }
    }

  }
  render() {
    if (this.state.buttonStatus !== "normal" && this.state.askCameraPermition) {
      return (
        <BarCodeScanner style={StyleSheet.absoluteFillObject} onBarCodeScanned={this.state.scan ? undefined : this.handleBarcode} />
      )
    }
    else if (this.state.buttonStatus === "normal") {
      console.log(this.state.scanData);
      return (
        <View style={{ flex: 1, justifyContent: 'center',alignItems:"center"}} >
          <View>
            <Image source={require("../assets/booklogo.jpg")} style={{ width: 200, height: 200, alignSelf: 'center' }}></Image>
          </View>

          <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
            <TextInput placeholder="Enter the book id" style={styles.inputbox} value={this.state.scanBookId} onChangeText={(text) =>
              this.setState(
                {
                  scanBookId: text
                }
              )
            } />
            <TouchableOpacity style={styles.scanbutton} onPress={() => {
              this.getCameraPermition("bookid")
            }}>
              <Text style={styles.scanbuttonText}>
                Scan
               </Text>
            </TouchableOpacity>

          </View>

          <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
            <TextInput placeholder="Enter the students id" style={styles.inputbox} value={this.state.scanStudentId} onChangeText={(text) =>
              this.setState(
                {
                  scanStudentId: text
                }
              )
            } />
            <TouchableOpacity style={styles.scanbutton} onPress={() => {
              this.getCameraPermition("studentid")
            }}>
              <Text style={styles.scanbuttonText}>
                Scan
             </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this.handleTransation}>
            <Text style={styles.buttonText}>
              Submit
              </Text>
          </TouchableOpacity>
        </View>

      );
    }
  }
}
const styles = StyleSheet.create({
  scanbutton: {
    backgroundColor: '#66BB6A',
    width: 50,
    borderWidth: 1.5,
    borderLeftWidth: 0
  },
  inputbox: {
    width: 200,
    height: 40,
    borderWidth: 1.5,
    borderRightWidth: 0,
    fontSize: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  scanbuttonText: { fontSize: 15, textAlign: 'center', marginTop: 10 },
});
