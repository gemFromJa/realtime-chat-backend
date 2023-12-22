const axios = require("axios");
const key = process.env.TRANSLATION_KEY;
const url = process.env.TRANSLATION_URL;

/*
 *
 * @param {String} text
 * @param {String} from
 * @param {Array} to
 */
async function translate(text, from, to) {
    const targetLanguages = to.reduce(
        (result, curr, i) => ({ ...result, [`to[${i}]`]: curr }),
        {}
    );
    const options = {
        method: "POST",
        url: "https://microsoft-translator-text.p.rapidapi.com/translate",
        params: {
            "api-version": "3.0",
            from,
            // "to[0]": "<REQUIRED>",
            ...targetLanguages,
            textType: "plain",
            profanityAction: "NoAction",
        },
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": key,
            "X-RapidAPI-Host": url,
        },
        data: [
            {
                Text: text,
            },
        ],
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    translate,
};
