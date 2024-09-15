const { createApp, ref } = Vue

createApp({
    setup() {
        const api = ref("")
        const api_category = ref("")
        const api_type = ref("")
        const api_img = ref("")
        const no_data_selected = ref(true)
        const on_search = ref(false)
        const img_loaded = ref(false)
        const categories = ref("")
        const tags = ref("")
        
        function getCategory(){
            switch(api.value){
                case "0":
                    categories.value = ["SFW", "NSFW"]
                    break;
                case "1":
                    categories.value = ["SFW"]
                    break;
                case "2":
                    categories.value = ["SFW", "NSFW"]
                    break;
                default:
                    break;
            }
            api_category.value = categories.value[0]
            getTags()
        }

        async function getTags(){
            try{
                let res = ""
                switch (api.value){
                    case "0":
                        res = await axios.get("https://api.waifu.im/tags")
                        if(api_category.value == "SFW"){
                            tags.value = res.data.versatile
                        } else if(api_category.value == "NSFW") {
                            tags.value = res.data.nsfw
                        }
                        break;
                    case "1":
                        res = await axios.get("https://nekos.best/api/v2/endpoints")
                        tags.value = Object.keys(res.data).map((key) => [key, res.data[key]]).map((data) => data[0])
                        break;
                    case "2":
                        if(api_category.value == "SFW"){
                            tags.value = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold", "nom", "bite", "glomp", "slap", "kill", "kick", "happy", "wink", "poke", "dance", "cringe"]
                        } else if(api_category.value == "NSFW") {
                            tags.value = ["waifu", "neko", "trap", "blowjob"]
                        }
                        break;
                    default:
                        break;
                }
                api_type.value = tags.value[0]
                no_data_selected.value = false
            } catch (err){
                alert(`ERROR : ${err}`)
            }
        }

        async function generateImage(){
            on_search.value = true
            try{
                api_img.value = ""
                let res = ""
                let category = api_category.value.toLowerCase()
                switch(api.value){
                    case "0":
                        res = await axios.get(`https://api.waifu.im/search?included_tags=${api_type.value}`)
                        api_img.value = res.data.images[0].url
                        break;
                    case "1":
                        res = await axios.get(`https://nekos.best/api/v2/${api_type.value}`)
                        api_img.value = res.data.results[0].url
                        break;
                    case "2":
                        res = await axios.get(`https://api.waifu.pics/${category}/${api_type.value}`)
                        api_img.value = res.data.url
                        break;
                    default:
                        break;
                }
            } catch (err) {
                alert(err)
                on_search.value = false
            }
        }

        function loadImage(){
            img_loaded.value = true
            on_search.value = false
        }

        return {
            api,
            api_category,
            api_type,
            api_img,
            on_search,
            img_loaded,
            no_data_selected,
            tags,
            categories,
            getCategory,
            getTags,
            generateImage,
            loadImage
        }
    }
}).mount('#app')