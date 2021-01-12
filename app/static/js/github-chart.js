
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class GithubChart {
    constructor(user, token) {
        this.token = token
        this.user = user
        this.urlInfoUser = "https://api.github.com/users/" + user
        this.urlRepositoies = "https://api.github.com/users/" + user + "/repos?per_page=100&page="
        this.urlRepos = "https://api.github.com/repos/" + user
    }

    async getInfoUser() {
        return await new Promise((resolutionFunc, rejectionFunc) => {
            var xhr = new XMLHttpRequest()
            xhr.open("GET", this.urlInfoUser, false)
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolutionFunc(JSON.parse(xhr.responseText))
                    } else {
                        resolutionFunc(JSON.parse(xhr.responseText))
                    }
                } else {
                    resolutionFunc(JSON.parse(xhr.responseText))
                }
            }
            xhr.onerror = function (e) {
                rejectionFunc(e)
            }
            xhr.setRequestHeader("Authorization", this.token)
            xhr.send(null)
        })
    }

    async getRepositories(pages) {
        return await new Promise((resolutionFunc, rejectionFunc) => {
            var dictLanguages = {}
            var dictTopics = {}
            var xhr = new XMLHttpRequest()

            for(var i = 1; i<=pages; i++) {
                xhr.open("GET", this.urlRepositoies + i, false)
                xhr.onload = function (e) {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            JSON.parse(xhr.responseText).forEach(_ => {
                                if(!_.fork) {
                                    if(dictLanguages.hasOwnProperty(_.language))
                                        dictLanguages[_.language] = dictLanguages[_.language] + 1
                                    else dictLanguages[_.language] = 1

                                    _.topics.forEach(_ => {
                                        if(dictTopics.hasOwnProperty(_))
                                            dictTopics[_] = dictTopics[_] + 1
                                        else dictTopics[_] = 1
                                    })
                                }
                            })
                        } else {
                            rejectionFunc(xhr.responseText)
                        }
                    }
                }
                xhr.onerror = function (e) {
                    rejectionFunc(e)
                }
                xhr.setRequestHeader("Authorization", this.token)
                xhr.setRequestHeader("Accept", "application/vnd.github.mercy-preview+json")
                xhr.send(null)
            }

            delete (dictLanguages['null'])
            var languages = [['Language', "Projects"]];
            for (var language in dictLanguages) {
                languages.push([language, dictLanguages[language]]);
            }
            languages.sort(function(a, b) {
                return b[1] - a[1];
            });

            var topics = [];
            for (var topic in dictTopics) {
                topics.push(topic);
            }
            topics.sort()

            resolutionFunc([languages, topics])
        })
    }

    async getLanguages(){
        return await new Promise((resolve, reject) => {
            this.getInfoUser().then(infoUser => {
                var public_repos = infoUser.public_repos
                const pages = Math.ceil(public_repos / 100)
                this.getRepositories(pages).then((val) => {
                    resolve(val)
                }).catch((val) => reject([]))
            }).catch((val) => reject([]))
        })
    }

}

//var github = new GithubChart("rigobertoCanseco", "adad12438fa11c6ff129e6452deca4b24da67e4d")
/*
github.getLanguages().then(array => {
    console.log(array)
}).catch((val) => {
    console.log("error", val)
});
*/
