import BookSchema from '../models/Book.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await BookSchema.find().limit(15).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 15);

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }
    var uniqueTags = tags.filter(onlyUnique);
    res.json(uniqueTags); ////////////////'В последнее время использовались такие теги'
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const getAll = async (req, res) => {
  try {
    const books = await BookSchema.find().exec(); 
    res.render('book-cards', { books });
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const getAllToAdmin = async (req, res) => {
  try {
    const books = await BookSchema.find().exec(); 
    res.render('admin-books', { books });
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const getOne = async (req, res) => {
  try {
    const book = await BookSchema.findOne({ _id: req.params.id });
    if (!book) {
      return res.render('./404.ejs');
    }
    res.render('book-card.ejs', { book });
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const getOneToAdmin = async (req, res) => {
  try {
    const book = await BookSchema.findOne({ _id: req.params.id });
    if (!book) { return res.render('./404.ejs'); }
    res.render('admin-book.ejs', { book });
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const remove = async (req, res) => {
  try {
    const deletingBook = await BookSchema.findByIdAndDelete(req.body.bookId)
    if (!deletingBook) { return res.render('./404.ejs');}
    res.json({message: 'Книга была удалена'})
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const create = async (req, res) => {
  try {
    
    var tagsArray;
    if (typeof req.body.tags === 'string') {
      tagsArray = req.body.tags.split(', ');
    } else {
      tagsArray = req.body.tags;
    }
    const bookData = new BookSchema({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        pageCount: req.body.pageCount,
        author: req.body.author,
        tags: tagsArray,
        price: req.body.price,
        count: req.body.count,
    });

    const newBook = await bookData.save();
    res.json(newBook);
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const update = async (req, res) => {
  try {
    const bookId = req.params.id;

    await BookSchema.updateOne(
      { _id: bookId, },
      {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        pageCount: req.body.pageCount,
        author: req.body.author,
        tags: req.body.tags.split(', '),
        price: req.body.price,
        count: req.body.count,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};

export const editParams = async (req, res) => {
  try {
    const findBook = await BookSchema.findById(req.body.bookId);
    console.log(req.body.bookId, findBook);
    console.log("----------------------");
    console.log(req.body.description);
    console.log(req.params.quantity);

    if(req.body.description != '' && req.body.description != null) { findBook.description = req.body.description;}
    
    findBook.count = parseInt(findBook.count) + parseInt(req.body.quantity);
    findBook.save();
	  res.json({ success: true, });
  } catch (err) {
    console.log(err);
    res.render('./errors/500.ejs');
  }
};