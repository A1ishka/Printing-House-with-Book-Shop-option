import BookModel from '../models/Book.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await BookModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const books = await BookModel.find().exec();
    res.json(books);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить книги',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const findBook = await BookModel.findOne({ _id: req.params.id });
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
    const postId = req.params.id;

    const deletingBook = await BookModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          success: true,
        });
      }).then(delBooks => {
        console.log(delBooks);
        res.render('reports',{data:json})
      });
    if (!deletingBook){
      return res.status(500).json({
        message: 'Не удалось удалить статью!!!!!!!!!!!!',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

/*export const remove = async (req, res) => {
  try {
    BookModel
    .findOne({_id: req.params.id })
    .then(doc => {
       res.json(doc); 
    },
    (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Не удалось вернуть книгу',
        });
       }
      if (!doc) {                         
        return res.status(404).json({
          message: 'Книга не найдена',
        });
      }
      res.json(doc);
      })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить книги',
    });
  }
};*/

export const create = async (req, res) => {
  try {
    const bookData = new BookModel({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        pageCount: req.body.pageCount,
        author: req.body.author,
        tags: req.body.tags.split(', '),
        price: req.body.price,
    });

    const newBook = await bookData.save();
    //bookData.replaceOne
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

    await BookModel.updateOne(
      {
        _id: bookId,
      },
      {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        pageCount: req.body.pageCount,
        author: req.body.author,
        tags: req.body.tags.split(','),
        price: req.body.price,
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
