const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const port = process.env.PORT || 9000;


//views engine middleware
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

//static folder for public or css file
app.use('/public', express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    //contact form
    res.render('contact',{
        layout:false
    });
});

//all info store in req.body when user press enter
app.post("/send",(req,res)=>{

    const output = `<p> you have new contact request></p>
<h3>Contact Details</h3>
<ul>
<li>name: ${req.body.name}</li>
<li>Company: ${req.body.company}</li>
<li>Email: ${req.body.email}</li>
<li>Phone: ${req.body.phone}</li>
</ul>
<h3>Message</h3>
${req.body.message}`;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "jamebuddha@gmail.com", // generated ethereal user
            pass: "", // generated ethereal password
        },
        //When using localhost
        tls: {
            rejectUnauthorized: false

        }
    });

    // send mail with defined transport object
    let info =  transporter.sendMail({
        from: '"Bikram subedi 👻" <bik@gmail.com>', // sender address
        to: "jamebuddha@gmail.com", // list of receivers
        subject: "Hello Test ✔", // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.render("contact",{msg:"email has been sent",layout:false})

})

app.listen(port,()=>console.log(`connecting to: ${port}`));
