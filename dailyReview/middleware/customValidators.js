
module.exports = {
    categoryDataValidationForReview: function (categoryName, categoryScore) {
        var validationResult;
        //console.log("  " + categoryName);
        //console.log("  " + categoryScore);
        //console.log("Number of arguments " + JSON.stringify(arguments, null, "  "));
        if (categoryName && categoryScore) {
            //console.log("Inside if");
            validationResult = (categoryName.length === categoryScore.length) && categoryName.length > 0 && categoryScore.length > 0;
            //console.log(validationResult);
            for (var i = 0; i < categoryScore.length; i++) {
                //console.log("inside for");
                if (categoryScore[i] > 0 && categoryScore[i] < 5) {

                } else {
                    //console.log("Inside for else" + categoryScore[i] + categoryName[i]);
                    validationResult = false;
                }
            }
            return validationResult;
        } else {
            //console.log("inside else");
            validationResult = false;
            return validationResult;
        }

    }
}
