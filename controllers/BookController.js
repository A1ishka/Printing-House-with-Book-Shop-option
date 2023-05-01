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
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const books = await BookSchema.find().exec();
    res.json(books);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить книги',
    });
  }
};

export const getBookByName = async (req, res) => {
  try {
    const books = await BookSchema.find().exec();
    //const books = await BookSchema.findOne({'name': req.param.name}).exec();
    //const result = books.filter(book => (book.name === req.param.name));
    const resullt = books.filter(book => (book.name.includes(req.params.name))); ///ни один из предложенных вариантов не дает результата
    res.json(resullt); //что-то не так именно с поиском по имени!!!
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось получить книги',});
  }
};

export const getOne = async (req, res) => {
  try {
    const findBook = await BookSchema.findOne({ _id: req.params.id });
    if (!findBook) {
      return res.status(404).json({
        message: 'book не найден',
      });
    
    }
    res.json(findBook);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить книги',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const deletingBook = await BookSchema.findByIdAndDelete(req.params.id)
    if (!deletingBook){
      return res.status(500).json({
        message: 'Не удалось удалить книгу!!!',
      });
    }
    res.json({message: 'Книга была удалена'})
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить книги',
    });
  }
};

export const create = async (req, res) => {
  try {
    const bookData = new BookSchema({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        pageCount: req.body.pageCount,
        author: req.body.author,
        tags: req.body.tags.split(', '),
        price: req.body.price,
        count: req.body.count,
    });

    const newBook = await bookData.save();
    res.json(newBook);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать книгу',
    });
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
    res.status(500).json({
      message: 'Не удалось обновить',
    });
  }
};
