module.exports = {
    reporters: [
        'default',
        ['jest-html-reporters', {
            publicPath: './test-report',
            filename: 'report.html',
            expand: true,
        }],
    ],
};
