//Homepage
exports.homepage = async(req, res) => {
    const locals = {
        title: 'Notes App',
        description: 'Just another practise'
    }

    res.render('index', {
        locals,
        layout: '../views/layouts/front-page'
    });
}


//About page
exports.about = async(req, res) => {
    const locals = {
        title: 'About - Notes App',
        description: 'Just another practise'
    }

    res.render('about', locals);
}