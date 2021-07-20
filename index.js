const inquirer = require('inquirer');
const emailValidator = require('email-validator');

class MarkdownRenderer {
    constructor(showLog = false) {
        this.showLog = showLog;
        this.render = this.render.bind(this);
        this.toc = [];
    }

    render(answers) {
        if (this.showLog) {
            console.log(`Markdown Renderer: starting markdown generation with answers:`);
            console.log(answers);
        }
        let buffer = "";
        let tableOfContentsBuffer = "# Table of Contents\r\n";

        // add the title
        buffer += "# " + answers.title + "\r\n";
        // add a table of contents at the end after the time
        let endOfTitlePosition = buffer.length;
        //  add the description
        buffer += "# Project Description\r\n" + answers.description + "\r\n";
        tableOfContentsBuffer += "-[Project Description](#project-description)\r\n";
        //  add the installation instructions





    }

    renderLicenseBadgeWithLink(license) {
        switch(license) {
            case "apache-2.0": return "[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)";
            case "cc": return "[![License: CC0-1.0](https://licensebuttons.net/l/zero/1.0/80x15.png)](http://creativecommons.org/publicdomain/zero/1.0/)";
            case "wtfpl": return "[![License: CC0-1.0](https://licensebuttons.net/l/zero/1.0/80x15.png)](http://creativecommons.org/publicdomain/zero/1.0/)";
            case "gpl-3.0": return "[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0";
            case "unlicense": return "[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)";
            case "none": return "";

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

        this.renderer = new MarkdownRenderer();
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
                when: this.when.isMandatory,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "description",
                type: "editor",
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
                default: "Installation Instructions",
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
                default: "Installation Instructions",
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
                default: "My github username",
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
                validate: emailValidator,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
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
                } else {
                    // Something else went wrong
                }
            });
    }

    writeToFile(filename, data) {
        console.log(`Writing to file ${filename}`);

    }


}

let showDebugOutput = true;

let generator = new ReadmeGenerator(showDebugOutput);
generator.init();
generator.start();