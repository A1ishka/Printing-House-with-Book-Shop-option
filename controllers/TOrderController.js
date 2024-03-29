import TOrderSchema from '../models/T-order.js';

export const createTOrder = async (req, res) => {
	try {
        const TOrderData = new TOrderSchema({
            name: req.body.name,
            phone: req.body.phone,
            image_select: req.body.image_select,
            obl_type: req.body.obl_type,
            checked: req.body.checked,
            count: req.body.count,
        });
    
        const newTOrder = await TOrderData.save();
        res.json(newTOrder);
      } catch (err) {
        console.log(err);
        res.render('./errors/500.ejs');
      }
    };

    export const countCost = async (req, res) => {
      try {
        const { obl_type, paper_type, pageCount, bookCount} = req.body;
        let totalPrice = 0;
          
        if (obl_type) {
          if (Array.isArray(obl_type)) {
            obl_type.forEach((item) => {
              switch (item) {
                case 'Мягкая':
                  totalPrice += 2;
                  break;
                case 'Твердая':
                  totalPrice += 5;
                  break;
                case 'Кожаная':                    
                  totalPrice += 15;
                  break;
              }
            });
            } else {
              switch (obl_type) {
                case 'Мягкая':
                  totalPrice += 2;
                  break;
                case 'Твердая':
                  totalPrice += 5;
                  break;
                case 'Кожаная':                    
                  totalPrice += 15;
                  break;
              }
            }
          }
        
          if (paper_type) {
            if (Array.isArray(paper_type)) {
              paper_type.forEach((item) => {                  
                switch (item) {
                  case 'Газетная':
                    totalPrice += 2;
                    break;
                  case 'Белая_неплотная':
                    totalPrice += 3;
                    break;
                  case 'Белая_плотная':
                    totalPrice += 5;
                    break;
                  case 'Цв_слоновой_кости':
                    totalPrice += 7;
                    break;
                  case 'Глянцевая':
                    totalPrice += 15;
                    break;
                  case 'Под_холст':
                    totalPrice += 10;
                    break;                 
                  }
                });
              } else {
                switch (paper_type) {
                  case 'Газетная':
                      totalPrice += 2;
                      break;
                    case 'Белая_неплотная':
                      totalPrice += 3;
                      break;
                    case 'Белая_плотная':
                      totalPrice += 5;
                      break;
                    case 'Цв_слоновой_кости':
                      totalPrice += 7;
                      break;
                    case 'Глянцевая':
                      totalPrice += 15;
                      break;
                    case 'Под_холст':
                      totalPrice += 10;
                      break;
                }
              }
            }

            if(paper_type == 'Глянцевая'){
              if (pageCount < 30) totalPrice*=1.2;
              else if (pageCount < 50) totalPrice*=1.4;
              else if (pageCount < 80) totalPrice*=1.6;
              else if (pageCount < 100) totalPrice*=1.8; 
              else if (pageCount < 150) totalPrice*=2;
              else totalPrice*=3; 
            }
            else if (pageCount < 300) totalPrice*=1.2;
            else if (pageCount < 500) totalPrice*=1.4;
            else if (pageCount < 800) totalPrice*=1.6;
            else if (pageCount < 1000) totalPrice*=1.8;
            else if (pageCount < 1300) totalPrice*=2;
            else totalPrice*=3;

            if (bookCount < 50) totalPrice*=bookCount;
            else if (bookCount < 100) totalPrice*=(bookCount*0.9);
            else if (bookCount < 300) totalPrice*=(bookCount*0.85);
            else if (bookCount < 1000) totalPrice*=(bookCount*0.7);
            else if (bookCount < 5000) totalPrice*=(bookCount*0.6);
            else totalPrice*=(bookCount*0.5);
            res.json({ totalPrice });
          } catch (err) {
            console.log(err);
            res.render('./errors/500.ejs');
          }
        };

        export const getPrintToAdmin = async (req, res) => {
          try {
            const orders = await TOrderSchema.find().exec(); 
            res.render('printing-house', { orders });
          } catch (err) {
            console.log(err);
            res.render('./errors/500.ejs');
          }
        };

    