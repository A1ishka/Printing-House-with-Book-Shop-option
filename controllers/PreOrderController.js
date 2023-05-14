import BookSchema from '../models/Book.js';
import PreOrderSchema from '../models/PreOrder.js';

export const createPreOrder = async (req, res) => {
	try {
	const book = await BookSchema.findById(req.body.bookId); 
  console.log(book);
  const doc = new PreOrderSchema({
		    bookId: book,
        bookName: book.name,
        bookPrice: book.price,
      	quantity: req.body.quantity 
    });

    if (book.count >= doc.quantity) 
    { book.count -= doc.quantity;
      await book.save(); }
    const newPreOrder = await doc.save();
	res.json(newPreOrder);
} catch (err) {
	console.log(err);
  res.render('./500.ejs');
}
};

export const updatePreOrder = async (req, res) => {
	try {
  const findPreOrder = await PreOrderSchema.findOne({ _id: req.body.preOrderId });
  const findBook = await BookSchema.findOne({ _id: findPreOrder.bookId });

  findBook.count += findPreOrder.quantity;
  await findBook.save();

  const updateCount = req.body.quantity;
  findPreOrder.quantity = updateCount;

  if (findBook.count >= findPreOrder.quantity) 
    { findBook.count -= findPreOrder.quantity;
      await findBook.save(); }

  await findPreOrder.save();
	res.json(findPreOrder);
} catch (err) {
	console.log(err);
  res.render('./500.ejs');
}
};

export const getPreOrderById = async (req, res) => {
  try {
    const findPreOrder = await PreOrderSchema.findOne({ _id: req.params.id });
    if (!findPreOrder) {
      return res.render('./404.ejs');;
    
    }
    res.json(findPreOrder);
  } catch (err) {
    console.log(err);
    res.render('./500.ejs');
  }
};