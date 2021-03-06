
const PostSchema = new mongoose.Schema({
    type:{type:String,default:'1'},// 1:text, 2:text+Image, 3: text+YoutubeLink ,4: ,
    contentType:{type:String,required:true}, //1. Theory, 2. Example Question, 3. Quiz
    data:{
        subject: {type: String,required: true},
        chapter: {type:String,required: true},
        topic:{type:String,required:true},
        subtopic:{type: String,require:true}
    },
    title:{type:String, required:true},
    subtitle:{type:String,required:true},    
    text:{type:String,required:true},
    image:{type:String,required:true,default:"NA"},
    video:{type:Number,default:5},
    author:{type:String,default:"unknown"},
    chapter:{type:String,default:'0'},//0:none, 1: NEET, 2: Mains/AIEEE, 3: Advanced, 4: state pmt
    contentType:{type:Number,default:0} //1: Theory, 2: Example 3: Quiz
    
})



module.exports = mongoose.model('Post', PostSchema)