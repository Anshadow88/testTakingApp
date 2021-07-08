const $QuestionID = document.getElementById('QuestionID')
const $FindQuestionByIDButton = document.getElementById('FindQuestionByIDButton')

const $FindChapterName = document.getElementById('FindChapterName')
const $FindChapterButton = document.getElementById('FindChapterButton')

const $FindTestName = document.getElementById('FindTestName')
const $FindTestButton = document.getElementById('FindTestButton')

const $FindByAuthorNameButton = document.getElementById('FindByAuthorNameButton')


const $questionNumber = document.getElementById('questionNumber')
const $newQuestionText = document.querySelector('#newQuestionTyped')
const $correctAnswer = document.querySelector('#correctAnswer')
const $chapterNumber = document.querySelector('#chapterNumber')
const $questionType = document.getElementById('questionType') 
const $subjectName = document.getElementById('subjectName')

const $newSolutionTyped = document.querySelector('#newSolutionTyped')
    


const $previousButton = document.querySelector('#previousButton')
const $nextButton = document.querySelector('#nextButton')


const $showMathButton = document.querySelector('#showMathButton')
const $writeMathsButton = document.querySelector('#writeMathsButton')
const $postQuestionButton = document.querySelector('#postQuestionButton')

let QUESID
let QuestionsOFChapters
let QuestionCount=0
let imageKeyAWS
let imageSolutionAWS

const $questionTextWithMath = document.querySelector('#newQuestionWithMaths')
const $newSolutionWithMaths = document.querySelector('#newSolutionWithMaths')


let selectedChapter = ""
let selectedAnswer = ""

let $image = document.getElementById('image')
const inputImage = document.getElementById('imageInput');
let imageFile
// add event listener
inputImage.addEventListener('change', () => {
    imageFile = inputImage.files[0]
});

let $imageSolution = document.getElementById('imageSolution')
const inputImageSolution = document.getElementById('inputImageSolution');
let imageFileSolution
// add event listener
inputImageSolution.addEventListener('change', () => {
    imageFileSolution = inputImageSolution.files[0]
    console.log('imageFileSolution'+imageFileSolution)
});

$FindQuestionByIDButton.addEventListener('click',(e)=>{
    QUESID = $QuestionID.value
    getQuestion(QUESID)
})

$FindChapterButton.addEventListener('click',(e)=>{
    chapterName = $FindChapterName.value
    getQuestionOfChapter(chapterName)
})

$FindTestButton.addEventListener('click',(e)=>{
    testName = $FindTestName.value
    getQuestionOfTests(testName)
})

$FindByAuthorNameButton.addEventListener('click', (e)=>{  
    AuthorName = document.getElementById('FindByAuthorName')
    console.log(AuthorName.value)
    getQuestionByAuthor(AuthorName.value)
})

$showMathButton.addEventListener('click',(e)=>{

   modifiedText = $newQuestionText.value.replace(/(?:\r\n|\r|\n)/g, "<br>")    
   $questionTextWithMath.innerHTML = modifiedText   
})

let $showSolutionMathButton = document.getElementById('showSolutionMathButton')
$showSolutionMathButton.addEventListener('click',(e)=>{

    modifiedSolutionText = $newSolutionTyped.value.replace(/(?:\r\n|\r|\n)/g, "<br>")    
    document.getElementById('newSolutionWithMaths').innerHTML = modifiedSolutionText   
 })

$nextButton.addEventListener('click',(e)=>{
    QuestionCount++
    showCurrentQuestion()
    
})

$nextBigButton = document.getElementById('nextBigButton')
$nextBigButton.addEventListener('click',(e)=>{
    QuestionCount+=25
    showCurrentQuestion()
    
})

$previousButton.addEventListener('click',(e)=>{
    QuestionCount--
    showCurrentQuestion()
})

$previousBigButton = document.getElementById('previousBigButton')
$previousBigButton.addEventListener('click',(e)=>{
    QuestionCount-=25
    showCurrentQuestion()
})

$postQuestionButton.addEventListener('click',(e)=>{    

    console.log('imageFileSolution'+imageFileSolution)
    console.log('imageFile'+imageFile)
    if(imageFile)
    {console.log('Reacher 0')
        uploadFile(imageFile)}
    else if(imageFileSolution)
    {   console.log('Reacher 1')
        uploadSolutionFile(imageFileSolution)}
    else
    {
        console.log('Reacher 3')
        UpdateAQuestion()}
})

async function getQuestion(quesID){     
    //console.log("Global: "+TOKEN)
    const response  = await fetch("/questions/"+quesID, {          
    // Adding method type
    method: "GET",
      
    header: {
    },

    
    // Adding body or contents to send
        // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    console.log(data)
    //$newQuestionText.append(data.question)
    //$image.src = '/uploads/'+QUESID+'.png'
    QuestionsOFChapters = []
    QuestionsOFChapters.push(data.question)
    QuestionCount=0
    showCurrentQuestion()
    
}

async function getQuestionOfChapter(chapter){     
    //console.log("Global: "+TOKEN)
    const response  = await fetch("/questions/chapter", {          
    // Adding method type
    method: "POST",
      
    header: {
    },

    body: JSON.stringify({
        chapter : chapter
    }),
    // Adding body or contents to send
        // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    QuestionsOFChapters = data
    console.log(data)
    QuestionCount = QuestionsOFChapters.length-1
    showCurrentQuestion()
    
}

async function getQuestionByAuthor(AuthorName){     
    console.log("Author: "+AuthorName)
    const response  = await fetch("/questions/author", {          
    // Adding method type
    method: "POST",
      
    header: {
    },

    body: JSON.stringify({
        author : AuthorName
    }),
    // Adding body or contents to send
        // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    QuestionsOFChapters = data
    console.log(data)
    QuestionCount = QuestionsOFChapters.length-1
    showCurrentQuestion()
    
}

async function getQuestionOfTests(testName){   
    console.log("Author: "+testName)
    const response  = await fetch("/testPaperWithNameForEditing", {          
    // Adding method type
    method: "POST",
      
    header: {
    },

    body: JSON.stringify({
        testName : testName
    }),
    // Adding body or contents to send
        // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then().then()

    var data = await response.json()   
    QuestionsOFChapters = data.questionsOfChapter
    
    QuestionCount = 0
    showCurrentQuestion()

    
}

// $chapterNumber.addEventListener('change',(e)=>{
//     console.log(chapterNumber.value)
//     CreateTopicNameDiv('Physics',chapterNumber.value)    

//     })


async function showCurrentQuestion(){
    //Remove Selected image for last update  
    //console.log(QuestionsOFChapters)
    inputImage.value=''   
    inputImageSolution.value=''
    if(QuestionCount>=QuestionsOFChapters.length)QuestionCount=QuestionsOFChapters.length-1
    if(QuestionCount<0) QuestionCount=0
    $questionNumber.innerHTML = 'Question No.&nbsp'+(QuestionCount+1)+'/'+QuestionsOFChapters.length+ '&nbsp&nbsp&nbspID:'+QuestionsOFChapters[QuestionCount]._id
    $newQuestionText.value = (QuestionsOFChapters[QuestionCount].question);
    $correctAnswer.value= (QuestionsOFChapters[QuestionCount].answer);
    $chapterNumber.value = (QuestionsOFChapters[QuestionCount].chapter);  
    $subjectName.value=(QuestionsOFChapters[QuestionCount].subject)
    $questionType.value = QuestionsOFChapters[QuestionCount].type;
    $image.style.display='none'
    if(QuestionsOFChapters[QuestionCount].image&&QuestionsOFChapters[QuestionCount].image!='')
    {
     console.log('ARE WE LOOKING FOR AWS Question')
     $image.style.display=''
     image.src = ('/uploads/'+QuestionsOFChapters[QuestionCount].image)       
    }
    $imageSolution.style.display='none'
    if(QuestionsOFChapters[QuestionCount].solutionImage&&QuestionsOFChapters[QuestionCount].solutionImage!='')
    {
     console.log('ARE WE LOOKING FOR AWS for Solution')
     $imageSolution.style.display=''
     imageSolution.src = ('/uploads/'+QuestionsOFChapters[QuestionCount].solutionImage)     
    }

    if(QuestionsOFChapters[QuestionCount].solution)
    {
        $newSolutionTyped.value = QuestionsOFChapters[QuestionCount].solution
    }

    modifiedText = $newQuestionText.value.replace(/(?:\r\n|\r|\n)/g, "<br>")    
    $questionTextWithMath.innerHTML = modifiedText  
    
    
    modifiedSolutionText = $newSolutionTyped.value.replace(/(?:\r\n|\r|\n)/g, "<br>")    
    $newSolutionWithMaths.innerHTML = modifiedSolutionText  

}

async function uploadFile(file) {
    imageKeyAWS=''
    // add file to FormData object
    const fd = new FormData();
    fd.append('avatar', file);

    // send `POST` request
    const response = await fetch('/questions/'+QUESID+'/image', {
        method: 'POST',
        body: fd
    })
    .then()
    .then()
    .catch()
    
    
    var data = await response.json()
    console.log(data.filename)
    imageKeyAWS = data.filename

    
    UpdateAQuestion()

}
async function uploadSolutionFile(file) {
    console.log('Reacher 4')
    imageSolutionAWS=''
    // add file to FormData object
    const fd = new FormData();
    fd.append('avatar', file);

    // send `POST` request
    const response = await fetch('/questions/'+QUESID+'/image', {
        method: 'POST',
        body: fd
    })
    .then()
    .then()
    .catch()
    
    
    var data = await response.json()
    console.log(data.filename)
    imageSolutionAWS = data.filename
    UpdateAQuestion()

}

async function UpdateAQuestion(){            
        
        //console.log(questionwiseResut)
        const response  = await fetch("/questionUpdate/"+QuestionsOFChapters[QuestionCount]._id, {          
        // Adding method type
        method: "PATCH",
          
        header: {
            //"Authorization": "Bearer " + TOKEN
        },
        // Adding body or contents to send
        body: JSON.stringify({
            question: $newQuestionText.value,
            answer: $correctAnswer.value,
            solution: $newSolutionTyped.value,
            chapter: $chapterNumber.value,
            image : imageKeyAWS,
            solutionImage : imageSolutionAWS,
            type: $questionType.value,
            subject: $subjectName.value,
            

        }),
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then().then()

        var data = await response.json()   
        console.log(data)
    }
    
// //REGION
//     let Phy01 = ["Units & Dimensions","Significant figures","Maxima Minima","Vector Addition & Subtraction",
//                  "Resolution of Vectors","Dot Product","Cross Product","Diffrentiation", "Integration"]

//     let Phy02 = ["Distance & Displacement","Average & Instantaneous Values","Equation of Motion",
//                   "Projectile Motion","Relative Motion","Graphs of Motion"]
    
//     let Phy03 = ["1st Law: Inertia","2nd Law: Rate of Change of Momentum","3rd Law Action Reaction",
//                  "Normal Reaction","Tension Force","Friction Force","Spring Force","Pseudo Force"
//                  ,"Equllibrium of Forces","Circular Motion"]
    
//     let Phy04 = ["Work done by Constant Force","Kinetic energy","Work-energy theorem","Potential energy",
//                  "Conservative forces","Conservation of mechanical energy","Vertical Circular Motion"]
    
//     let Phy05 = ["Law of COM","Collisions","Centre of Mass","Motion of CM",
//                   "Variable Mass Density"]
    
//     let Phy06 = ["Angular Displacement, Velocity & Acceleration","Moment of Inertia","Parallel & Perpendicular Axis"
//                 ,"Angular Momentum","Torque","Conservation of Angular Momentum","Radius of Gyration",
//                  "Rotational Kinetic Energy","Energy in Rolling Motion","Friction In Rolling Motion"]
    
//     let Phy07 = ["Elastic behavior","Hooke's Law Stress-Strain ","Poisson's ratio","Elastic energy"]
    
//     let Phy08 = ["Universal law of gravitation","Acceleration due to gravity","Gravitational potential energy"
//                  ,"Gravitational Field","Gravitational Potential & PE","Escape velocity","Satellites",
//                  "Keplar's laws"]
    
//     let Phy09 = ["Pascal's law","Pressure In Fluids","Buoyancy Force","Continuity Equation",
//                  "Bernoulli's Theorm","Venturimeter","Viscosity: Viscous Force","Poiseuilli's Equation",
//                  "Surface Tension","Angle Of Contact","Capilliary Action","Pressure in Bubbles","Surface Energy"]
   
//     let Phy10 = ["Thermal expansion","Calorimetry","Thermometry","Conduction","Radiation: Stefan's Law","Wein's displacement Law",
//                  "Newton's Laws of Cooling","Kinetic Theory of Gases","Ideal Gas Equation",
//                  "First Law of Thermodynamics","Heat Engine"]

//     let Phy11 = ["Oscillation,SHM & Periodic Motion","Equation of SHM","Spring Block System","Simple Pendulum"
//                 ,"Energy In Oscillation","Damped Oscillation"]

//     let Phy12 = ["Equation Of Wave","Speed of wave motion","reflection of waves","superposition of waves"
//                 ,"standing waves in strings","Organ Pipes","Resonance Tube","Beats","Doppler's Effect"]

//     let Phy13 = ["Properties of Charge","Coulomb's Law","Electric Field","Electric Flux","Electric Dipole","Gauss's Law","Electric Potential",
//                 "Equipotential surfaces","Potential Energy","Dielectrics","Capacitors",];

//     let Phy14 = ["Electric current","Drift velocity","Ohm’s law","Resistance with Temperature","Colour coding",
//                     "Series and Parallel","Symmetries In Circuits","Ammeter & Voltmeter",
//                     "Kirchhoff’s laws","Internal resistance of a cell","Combination of cells","Wheatstone & meter bridge",
//                     "Potentiometer"]
//     let Phy15 = ["Magnetic Force","Biot-Savart law","Ampere’s law","Magnetic Field due to Current","Motion of Charge in Field",
//                     "Cyclotron","Magnetic Force on a wire","Torque on a loop","Magnetic Dipole Moment & Field",
//                     "Torque on a Magnet","Earth’s magnetic field","Para-, dia- and ferro - magnetic","Hysteresis Curve",
//                     ]
//      let Phy16 = ["Faraday’s laws","Lenz’s Law","Eddy currents","Self and mutual induction","Peak and RMS values",
//                     "Reactance(X) and Impedance(Z)","LC oscillations","LCR series circuit","Resonance in AC Circuits",
//                     "Power in AC circuits","Wattless current","Transformers"]
    
//     let Phy17 = ["Reflection on Plane Mirrors","Spherical mirrors","Mirror formula","Refraction of light","Total internal reflection",
//                     "Refraction at spherical surfaces","Lens Maker Formula","The Lens Formula","Power & Combination of Lens",
//                     "Lens & Mirror Combined","Prism","Optical Instruments"]
    
//     let Phy18 = ["Wave front and Huygen's principle","Interference Young's double slit experiment"
//                  ,"Diffraction due to a single slit","Resolving power of microscopes and telescopes",
//                  "Polarisation","Electromagnetic waves"]
    
//     let Phy19 = ["Dual nature of radiation","Photoelectric effect","Matter waves & de Broglie wavelength",
//                  "Davisson-Germer experiment","Alpha-particle scattering","Bohr model","Hydrogen spectrum"
//                  ,"Nucleus","Radioactivity","Mass defect & Binding energy","Nuclear fission & fusion"]
    
//     let Phy20 = ["Energy band in Solids","P-N Junction Diode","Zener Diode","Logic Gates","Transistors"]
    
    
//     let PhysicsChapterTopics =[Phy01,Phy02,Phy03,Phy04,Phy05,Phy06,Phy07,Phy08,Phy09,Phy10,
//                         Phy11,Phy12,Phy13,Phy14,Phy15,Phy16,Phy17,Phy18,Phy19,Phy20]





// function CreateTopicNameDiv(Subject,Chapter)
// {
//     const $selectList=document.getElementById('topicName')
//     while($selectList.hasChildNodes())
//         {
//             $selectList.removeChild($selectList.firstChild);
//         }

//     if(Subject=='Physics')
//     {
//             let chapter = parseInt(Chapter)

//             let array = PhysicsChapterTopics[chapter-1]
//             console.log(chapter)
//             //Create and append the options
//             for (var i = 0; i < array.length; i++) {
//                 var option = document.createElement("option");
//                 option.value = array[i];
//                 option.text = chapter+'.'+(i+1)+' '+array[i];
//                 $selectList.appendChild(option);
//             }

        
//     }
// }