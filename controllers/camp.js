const { cloudinary } = require('../cloudinary');
const CampGround = require('../models/campGround');

module.exports.viewAllCamps = async (req, res) => {
    const camps = await CampGround.find({});
    // console.log(camps);
    res.render('./camps/index', { camps });
}

module.exports.addNewCamp = async (req, res) => {
    const img = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    const newCamp = new CampGround(req.body.camp);
    newCamp.author = req.user._id;
    newCamp.image = img;
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
    const img = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    const { id } = req.params;
    const camp = await CampGround.findByIdAndUpdate(id, req.body.camp);
    camp.image.push(...img);
    if (req.body.deleteImage) {
        for (let delImage of req.body.deleteImage) {
            await cloudinary.uploader.destroy(delImage).then(res => {
            });
        }
        await camp.updateOne({ $pull: { image: { fileName: { $in: req.body.deleteImage } } } });
    }
    await camp.save();
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