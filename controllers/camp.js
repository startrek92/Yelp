const CampGround = require('../models/campGround');
module.exports.viewAllCamps = async (req, res) => {
    const camps = await CampGround.find({});
    // console.log(camps);
    res.render('./camps/index', { camps });
}

module.exports.addNewCamp = async (req, res) => {
    const newCamp = new CampGround(req.body.camp);
    newCamp.author = req.user._id;
    console.log(newCamp);
    await newCamp.save();
    req.flash('success', 'Camp added successfully');
    res.redirect(`/camps/${newCamp._id}`);
}

module.exports.newCampForm = (req, res) => {
    res.render('./camps/newCamp');
}

module.exports.viewCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await CampGround.findById(id).populate(
        {
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    console.log(camp);
    if (!camp) {
        req.flash('error', 'Cannot find campground');
        return res.redirect('/camps');
    }
    res.render('./camps/view', { camp });
}

module.exports.updateCampForm = async (req, res) => {
    const { id } = req.params;
    const camp = await CampGround.findById(id);
    if (!camp) {
        req.flash('error', 'Cannot find campground');
        return res.redirect('/camps');
    }
    res.render('./camps/edit', { camp });
}

module.exports.updateCamp = async (req, res, next) => {
    // console.log('/PATCH Request');
    // console.log(req);
    const { id } = req.params;
    const camp = await CampGround.findByIdAndUpdate(id, req.body.camp);
    if (!camp) {
        req.flash('error', 'Cannot find campground');
        return res.redirect('/camps');
    } else {
        req.flash('success', 'Camp updated successfully');
        res.redirect(`/camps/${camp._id}`);
    }
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await CampGround.findByIdAndDelete(id);
    // console.log(deletedCamp);
    req.flash('success', 'Camp deleted successfully');
    res.redirect('/camps');
}