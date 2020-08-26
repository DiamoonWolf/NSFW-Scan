const axios = require('axios')
const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')
const Discord = require("discord.js")
const { Console } = require("console")
const config = require("./config.json");
const prefix = config.BOT_PREFIX


const NSFWScan = new Discord.Client();



function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|png)$/) != null);
}

NSFWScan.on("ready", function() {

    NSFWScan.user.setActivity("catch NSFW content.")

    console.log("[18?] Bot is ready.")   
    
});




NSFWScan.on("message", function(message) {

    async function fn(imglink) {
        const pic = await axios.get(imglink, {
          responseType: 'arraybuffer',
        })
        const model = await nsfw.load() // To load a local model, nsfw.load('file://./path/to/model/')
        // Image must be in tf.tensor3d format
        // you can convert image to tf.tensor3d with tf.node.decodeImage(Uint8Array,channels)
        const image = await tf.node.decodeImage(pic.data,3)
        const predictions = await model.classify(image)
        image.dispose() // Tensor memory must be managed explicitly (it is not sufficient to let a tf.Tensor go out of scope for its memory to be released).


        let firstname = predictions[0]["className"]
        let firstval = (predictions[0]["probability"] *100).toFixed(1)
        let secondname = predictions[1]["className"]
        let secondval = (predictions[1]["probability"] *100).toFixed(1)
        let thirdname = predictions[2]["className"]
        let thirdval = (predictions[2]["probability"] *100).toFixed(1)
        let fourthname = predictions[3]["className"]
        let fourthval = (predictions[3]["probability"] *100).toFixed(1)
        let fifthname = predictions[4]["className"]
        let fifthval = (predictions[4]["probability"] *100).toFixed(1)

        const exampleEmbed = {
            color: 0xc45eb7,
            title: 'NSFW Scan',
            thumbnail: {
                url: imglink,
            },
            fields: [
                {
                    name: firstname,
                    value: firstval + "%",
                },
                {
                    name: secondname,
                    value: secondval + "%",
                },
                {
                    name: thirdname,
                    value: thirdval + "%",
                },
                {
                    name: fourthname,
                    value: fourthval + "%",
                },
                {
                    name: fifthname,
                    value: fifthval + "%",
                },
            ],
           
            timestamp: new Date(),
            footer: {
                text: 'requested by ' + message.member.user.tag,
                icon_url: 'https://i.imgur.com/WxZEC3z.png',
            },
        };

        message.channel.send({ embed: exampleEmbed });
        console.log(predictions)
        
    
      }



    if (message.content.startsWith(prefix + "nsfw")) {

        let command = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);
        message.delete()
        if(!checkURL(command)){
            message.delete()
            message.reply(" Syntax is :\n " + prefix + "nsfw <link>\nAccepted extensions are :\n .png\n .jpg\n .jpeg").then(msg => {
                msg.delete({ timeout: 10 * 1000 })
                
              })
              .catch(console.error());
        
            return;}

        fn(command)
    }

    

})



// Put your token in the config.json file --
NSFWScan.login(config.BOT_TOKEN).catch(console.error);
// --