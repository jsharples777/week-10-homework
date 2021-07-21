const inquirer = require('inquirer');
const fs = require('fs');
const moment = require('moment');

class MarkdownRenderer {
    constructor(showLog = false) {
        this.showLog = showLog;
        this.render = this.render.bind(this);
    }

    render(answers) {
        if (this.showLog) {
            console.log(`Markdown Renderer: starting markdown generation with answers:`);
            console.log(answers);
        }
        let buffer = "";
        let tableOfContentsBuffer = "\r\n# Table of Contents\r\n";

        // add the title
        buffer += `# ${answers.title}      ${this.renderLicenseBadgeWithLink(answers.license)}\r\n`;
        // add a table of contents at the end after the time
        let endOfTitlePosition = buffer.length;
        //  add the description
        buffer += `# Project Description\r\n${answers.description}\r\n\r\n`;
        tableOfContentsBuffer += "- [Project Description](#project-description)\r\n";
        //  add the installation instructions
        buffer += `# Installation Instructions\r\n\r\n${answers.install}\r\n\r\n`;
        tableOfContentsBuffer += "- [Installation Instructions](#installation-instructions)\r\n";
        //  add the usage instructions
        buffer += `# Usage\r\n\r\n${answers.use}\r\n\r\n`;
        tableOfContentsBuffer += "- [Usage](#usage)\r\n";
        //  add the screenshot
        if (answers.screenshot) {
            buffer += `# Screenshot\r\n\r\n![screenshot](${answers.screenshot})\r\n\r\n`;
            tableOfContentsBuffer += "- [Screenshot](#screenshot)\r\n";
        }
        //  add the contribution instructions
        buffer += `## How to contribute\r\n\r\n${answers.contribute}\r\n\r\n`;
        tableOfContentsBuffer += "- [How To Contribute](#how-to-contribute)\r\n";
        if (answers.test) {
            //  add the testing instructions
            buffer += `# Testing Instructions\r\n\r\n${answers.test}\r\n\r\n`;
            tableOfContentsBuffer += "- [Testing Instructions](#testing-instructions)\r\n";
        }
        //  add the technologies used
        if (answers.technology) {
            buffer += `# Technology \r\n\r\n ${answers.technology} \r\n\r\n`;
            tableOfContentsBuffer += "- [Technology](#technology)\r\n";
        }
        //  add the question instructions
        buffer += `# Questions\r\n\r\n>  **Direct your questions about this project to:**\r\n>\r\n>  *GitHub:* [Github Project Link](https://github.com/${answers.username}/${answers.project})\r\n>\r\n>  *Email:* [${answers.email}](mailto:${answers.email})\r\n\r\n`;
        tableOfContentsBuffer += "- [Questions](#questions)\r\n";
        //  add the license attribution text
        buffer += `# License\r\n\r\n${this.renderLicenseAttribution(answers.license)}`;
        tableOfContentsBuffer += "- [License](#license)\r\n\r\n";

        // add the TOC to the buffer in the correct location
        let beforeTOC = buffer.substr(0,endOfTitlePosition);
        let afterTOC = buffer.substr(endOfTitlePosition);

        let markdown = beforeTOC + tableOfContentsBuffer + afterTOC;
        if (this.showLog) console.log(markdown);
        return markdown;
    }

    renderLicenseBadgeWithLink(license) {
        switch(license) {
            case "apache-2.0": return "[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)";
            case "cc": return "[![License: CC0-1.0](https://licensebuttons.net/l/zero/1.0/80x15.png)](http://creativecommons.org/publicdomain/zero/1.0/)";
            case "wtfpl": return "[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-brightgreen.svg)](http://www.wtfpl.net/about/)";
            case "gpl-3.0": return "[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)";
            case "unlicense": return "[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)";
            case "mit": return "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)";
            case "none": return "";

        }
    }

    renderLicenseAttribution(license) {
        switch(license) {
            case "apache-2.0": return "### [Apache 2.0 License](https://opensource.org/licenses/Apache-2.0)\r\nA permissive license whose main conditions require preservation of copyright and license notices. Contributors provide an express grant of patent rights. Licensed works, modifications, and larger works may be distributed under different terms and without source code.";
            case "cc": return "### [The Creative Commons CC0 Public Domain Dedication](http://creativecommons.org/publicdomain/zero/1.0/) \r\nWaives copyright interest in a work you've created and dedicates it to the world-wide public domain. Use CC0 to opt out of copyright entirely and ensure your work has the widest reach. As with the Unlicense and typical software licenses, CC0 disclaims warranties. CC0 is very similar to the Unlicense.";
            case "wtfpl": return "### [The Do What The F*uck You Want License](http://www.wtfpl.net/about/)\r\nEveryone is permitted to copy and distribute verbatim or modified copies of this license document, and changing it is allowed as long as the name is changed."
            case "gpl-3.0": return "### [Gnu Public License 3.0](https://www.gnu.org/licenses/gpl-3.0)\r\nPermissions of this strong copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.";
            case "unlicense": return "### [Unlicense](http://unlicense.org/)\r\nA license with no conditions whatsoever which dedicates works to the public domain. Unlicensed works, modifications, and larger works may be distributed under different terms and without source code.";
            case "mit": return "### [MIT License](https://opensource.org/licenses/MIT)\r\nA short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.";
            case "none": return "No license selected.";

        }

    }
}


class Validator {
    constructor(showLog = false) {
        this.showLog = showLog;

        this.ensureNotEmptyString = this.ensureNotEmptyString.bind(this);
        this.canBeEmptyString = this.canBeEmptyString.bind(this);
    }

    ensureNotEmptyString(userInput, answersHash) {
        if (this.showLog) {
            console.log("Validator: ensure not empty string");
            console.log(userInput);
            console.log(answersHash);
        }
        let isEmpty = (userInput.trim().length === 0);
        if (isEmpty) {
            return `Value must be a non-empty string.`;
        }
        return true;
    }

    canBeEmptyString(userInput, answersHash) {
        return true;
    }

    isEmailAddress(userInput, answersHash) {
        if (this.showLog) {
            console.log("Validator: check for valid email address");
            console.log(userInput);
            console.log(answersHash);
        }
        return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(userInput);
    }
}

class Filter {
    constructor(showLog = false) {
        this.showLog = showLog;

        this.defaultFilter = this.defaultFilter.bind(this);
    }

    defaultFilter(userInput, answersHash) {
        if (this.showLog) {
            console.log("Filter: defaultFilter");
            console.log(userInput);
            console.log(answersHash);
        }
        return userInput;
    }
}

class Transformer {
    constructor(showLog = false) {
        this.showLog = showLog;

        this.defaultTransformer = this.defaultTransformer.bind(this);
        this.gitHubPrefix = this.gitHubPrefix.bind(this);
    }

    defaultTransformer(userInput, answersHash, options) {
        if (this.showLog) {
            console.log("Transformer: defaultTransformer");
            console.log(userInput);
            console.log(answersHash);
            console.log(options);
        }
        return userInput;
    }

    gitHubPrefix(userInput, answersHash, options) {
        if (this.showLog) {
            console.log("Transformer: gitHubPrefix");
            console.log(userInput);
            console.log(answersHash);
            console.log(options);
        }
        return "https://github.com/" + userInput;
    }
}

class When {
    constructor(showLog = false) {
        this.showLog = showLog;

        this.isMandatoryQuestion = this.isMandatoryQuestion.bind(this);
        this.isOptionalQuestion = this.isOptionalQuestion.bind(this);
    }

    isMandatoryQuestion(answersHash) {
        if (this.showLog) {
            console.log("When: isMandatory");
            console.log(answersHash);
        }
        return true;
    }

    isOptionalQuestion(answersHash) {
        if (this.showLog) {
            console.log("When: isOptional");
            console.log(answersHash);
        }
        return false;
    }
}


class ReadmeGenerator {
    constructor(showDebugOutput = false) {
        this.validator = new Validator(showDebugOutput);
        this.filter = new Filter(showDebugOutput);
        this.transformer = new Transformer(showDebugOutput);
        this.when = new When(showDebugOutput);

        this.renderer = new MarkdownRenderer(showDebugOutput);
    }

    init() {
        this.questions = [
            {
                name: "title",
                type: "input",
                message: "Please provide a title for the project:",
                default: "My Project",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "description",
                type: "input",
                message: "Please provide a description for the project:",
                default: "My Project Description",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "install",
                type: "editor",
                message: "Please provide a list of installation instructions for the project:",
                default: "1.  Install `npm install` 2. Step 2",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "use",
                type: "editor",
                message: "Please provide a list of how-to use the project:",
                default:"How to use",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "contribute",
                type: "input",
                message: "How should people contribute to the project:",
                default: "How to contribute",
                validate: this.validator.canBeEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "test",
                type: "input",
                message: "How should people test the project:",
                default: "How to run the tests (if any)",
                validate: this.validator.canBeEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "license",
                type: "list",
                message: "What is the license for the project:",
                choices: [
                    {
                        name: "Apache 2.0 License",
                        value: "apache-2.0",
                        short: "apache2"
                    },
                    {
                        name: "Creative Commons license family",
                        value: "cc",
                        short: "CC"
                    },
                    {
                        name: "MIT",
                        value: "mit",
                        short: "MIT"
                    },
                    {
                        name: "Do What The F*ck You Want To Public License",
                        value: "wtfpl",
                        short: "WTFPL"
                    },
                    {
                        name: "GNU General Public License v3.0",
                        value: "gpl-3.0",
                        short: "GPL3"
                    },
                    {
                        name: "The Unlicense",
                        value: "unlicense",
                        short: "unlicense"
                    },
                    {
                        name: "None",
                        value: "none",
                        short: "none"
                    },
                ],
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "username",
                type: "input",
                message: "GitHub username:",
                default: "mygithubusername",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "project",
                type: "input",
                message: "GitHub Project Name:",
                default: "mygithubproject",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "email",
                type: "input",
                message: "Email address:",
                default: "My email",
                validate: this.validator.isEmailAddress,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                //pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "technology",
                type: "editor",
                message: "List of technologies used:",
                default: "1. Technology 1",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                askAnswered: true,
                loop: true,
            },
            {
                name: "screenshot",
                type: "input",
                message: "Location and name of screenshot",
                default: "./assets/img/screenshot.png",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                askAnswered: true,
                loop: true,
            },
            {
                name: "filename",
                type: "input",
                message: "What filename should we output the readme markdown?",
                default: "README.md",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
        ];
    }

    start() {
        inquirer
            .prompt(this.questions)
            .then((answers) => {
                let markdown = this.renderer.render(answers);
                this.writeToFile(answers.filename, markdown);
            })
            .catch((error) => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                    console.log("Must be running in a terminal/command window.");
                } else {
                    console.log("Unknown error occurred.")
                }
            });
    }

    writeToFile(filename, data) {
        console.log(`Writing to file ${filename}`);
        // check to see if the file already exist
        fs.access(filename,fs.constants.F_OK, (err) => {
           let newFileName = filename;
           if (!err) {
               // file already exists
               // append a date and time to give it a unique name
               let filenameParts = filename.split(".");
               let now = moment().format("YYYYMMDDHHmmss");
               newFileName = filenameParts[0] + now + ".md";
               console.log(`${filename} already exists, writing data to ${newFileName}`);
           }

           let markdownFile = fs.createWriteStream(newFileName, {flags: 'w'});
           markdownFile.write(data);
           markdownFile.close();

        });
    }
}

let showDebugOutput = false;

let generator = new ReadmeGenerator(showDebugOutput);
generator.init();
generator.start();