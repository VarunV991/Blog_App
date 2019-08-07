var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

mongoose.connect("mongodb://localhost/blog",{ useNewUrlParser: true });

//App Config

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Mongoose Model Config

var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date, default: Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

//Blog.create({
//    name: "testblog",
//    image: "https://www.popsci.com/sites/popsci.com/files/styles/1000_1x_/public/images/2018/02/00-taking-photos.jpg?itok=2zWTBy2A&fc=50,50",
//    body: "This is a test blog"
//});

//Routes

app.get("/",function(req,res){
    res.render("home");
})

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blog){
        if(err){
            console.log("Oops");
        }
        else{
            res.render("index",{blog:blog});
        }
    })
})

app.get("/blogs/new",function(req,res){
    res.render("new");
})

//create route
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog,function(err,blogs){
        if(err){
            res.render("new");
        }    
        else{
            console.log("New Blog Added");
            console.log(blogs);
            res.redirect("/blogs");
        }
    })
})

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    })
})

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    })
})

//update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

//destroy route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,deletedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");            
        }
    })
})


app.listen(4200,process.env.IP,function(){
    console.log('Server is Running!!');
})