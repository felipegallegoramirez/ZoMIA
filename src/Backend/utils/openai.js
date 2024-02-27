require("dotenv").config();
const path = require('path');

const fs = require('fs');
const OpenAI=require("openai")
const openai= new OpenAI({
    apiKey:process.env.OPENAI_KEY
})

const whisper= async (video1,video2)=>{
    const filePath1 = path.join(__dirname, "/../storage/", video1);
    const filePath2 = path.join(__dirname, "/../storage/", video2);

    const response1 = await  openai.audio.transcriptions.create({
        file:fs.createReadStream(filePath1),
        model:"whisper-1"
    })

    const response2 = await  openai.audio.transcriptions.create({
        file:fs.createReadStream(filePath2),
        model:"whisper-1"
    })


    return {
        transcription1: response1,
        transcription2: response2
    };
}

const resumen = async (video1,video2)=>{
    let prompt=`

    Persona 1:
    ${video1}

    Persona 2:
    ${video2}

    Genera un resumen con las siguiente transcripciones planas pasada por cada uno de los individuos, crea el resumen y que lista de pendientes quedaron de la siguiente manera


    {
    'resumen':'Resumen de la conversacion',
    'pendientes':'Pendientes de la conversacion'
    }

    `

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: [{ role: "user", content: prompt }]
        });
        return response.choices[0].message.content
    } catch (error) {
        console.error("Hubo un error:", error);
    }


    


}


module.exports ={whisper,resumen}