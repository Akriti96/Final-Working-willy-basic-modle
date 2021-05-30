  handleTransation = async () => {
    const bookref = await db.collection("books").where("bookid", "==", this.state.scanBookId).get()
    console.log("book")
    bookref.docs.map((doc) => {
      var book = doc.data()
      console.log(book)
      if (book.bookavailability) {
        this.initiatebook()
      }
      else {
        this.returnbook()
      }

    })
  }