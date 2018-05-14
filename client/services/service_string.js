let unwanted_regex = /(Š|š|Ž|ž|À|Á|Â|Ã|Ä|Å|Æ|Ç|È|É|Ê|Ë|Ì|Í|Î|Ï|Ñ|Ò|Ó|Ô|Õ|Ö|Ø|Ù|Ú|Û|Ü|Ý|Þ|ß|à|á|â|ã|ä|å|æ|ç|è|é|ê|ë|ì|í|î|ï|ð|ñ|ò|ó|ô|õ|ö|ø|ù|ú|û|ý|þ|ÿ|Ğ|İ|Ş|ğ|ı|ş|ü|ă|Ă|ș|Ș|ț|Ț)/gi;

let unwanted_replace = { 'Š': 'S', 'š': 's', 'Ž': 'Z', 'ž': 'z', 'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'A', 'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ý': 'Y', 'Þ': 'B', 'ß': 'ss', 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'a', 'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ð': 'o', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ý': 'y', 'þ': 'b', 'ÿ': 'y', 'Ğ': 'G', 'İ': 'I', 'Ş': 'S', 'ğ': 'g', 'ı': 'i', 'ş': 's', 'ü': 'u', 'ă': 'a', 'Ă': 'A', 'ș': 's', 'Ș': 'S', 'ț': 't', 'Ț': 'T' };

let clean = str => str.replace(unwanted_regex, char => unwanted_replace[char]);

let firstCase = str => str.charAt(0).toUpperCase() + str.slice(1);

let toCammelCase = (str, separator = " ") => {
    let list = clean(str).split(separator),
        i = 1,
        l = list.length;

    list[0] = list[0].charAt(0).toLowerCase() + list[0].slice(1);

    for (; i < l; i++) {
        list[i] = firstCase(list[i]);
    }

    return list.join("");
};

let toPascalCase = (str, separator = " ") => firstCase(toCammelCase(str, separator));

let toSnakeCase = (str, separator = "-") => clean(str).split(" ").join(separator);

let toWords = (str, separator = "-") => (str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, " $1")).split(separator).join(" ");

export default {
    clean,
    firstCase,
    toPascalCase,
    toCammelCase,
    toSnakeCase,
    toWords
};
