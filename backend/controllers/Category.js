const Category = require("../models/category");
const{Mongoose} = require("mongoose");
const Job = require("../models/Job")


function getRandomInt(max){
  return Math.floor(Math.random()*max)
}

//create category handler
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log("Request body:", req.body);

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const CategoryDetails = await Category.create({ name, description });
    console.log("Category created:", CategoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      category: CategoryDetails,
    });
  } catch (error) {
    console.error("Error in createCategory:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};


//allcategoriess handler function

exports.showAllcategories = async (req, res) => {
  try {

    const allcategories = await Category.find(
      {},
      {name:true, description:true}

    );
    return res.status(200).json({
      success: true,
      message: 'All categories returned successfully',
      data: allcategories,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//category page details
exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      // console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get jobs for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "jobs",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()
  
      //console.log("SELECTED JOB", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no jobs
      if (selectedCategory.jobs.length === 0) {
        console.log("No jobs found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No jobs found for the selected category.",
        })
      }
  
      // Get jobs for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "jobs",
          match: { status: "Published" },
        })
        .exec()
        //console.log("Different JOB", differentCategory)
      // Get top-selling Jobs across all categories
      const allCategories = await Category.find()
        .populate({
          path: "jobs",
          match: { status: "Published" },
          populate: {
            path: "contractor",
        },
        })
        .exec()
      const allJobs = allCategories.flatMap((category) => category.jobs)
      const mostDoingJobs = allJobs
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)

        res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostDoingJobs,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }