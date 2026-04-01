module.exports = {
    default: {
        requireModule: ['tsx/cjs'],
        require: ['step-definitions/**/*.steps.ts'],
        paths: ['features/**/*.feature'],
        format: ['progress-bar', 'html:reports/cucumber-report.html'],
        publishQuiet: true
    }
};