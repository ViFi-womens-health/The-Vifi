const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

//GET router to fetch health categories database
router.get('/', rejectUnauthenticated, function (req, res) {
    console.log('in /preventativecare GET router');

    let sqlText = `SELECT * FROM "health_category";`;
   
    pool.query(sqlText)
   
    .then(dbRes => {
      res.send(dbRes.rows);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    })
});

router.get('/:catId/ages/:ageId', rejectUnauthenticated, async (req, res) => {
    console.log('in preventativecare id router');

    let faqSQLText = `
    SELECT ("question"), ("answer"), ("id") FROM "faq"
    WHERE "health_category_id" = $1 AND "age_range_id"=$2;`;

    let diagSQLText = `SELECT ("name"), ("info"), ("id") FROM "diagnostic_tool"
    WHERE "health_category_id" = $1 AND "age_range_id"=$2;`;

    let guidelinesSQLText = `SELECT ("name"), ("info"), ("grade"), ("date"), ("id") FROM "guidelines"
    WHERE "health_category_id" = $1 AND "age_range_id"=$2;`;

    let drQuestionsSQLText = `SELECT ("question"), ("id") FROM "doctor_questions"
    WHERE "health_category_id" = $1 AND "age_range_id"=$2;`;

    // Get category details
    try{

    //Get FAQs  
    let faqRes = await pool.query(faqSQLText, [req.params.catId, req.params.ageId]);
    console.log('faqRes is', faqRes);

    //Get diagnostic tools
    let diagRes = await pool.query(diagSQLText, [req.params.catId, req.params.ageId]);

    //Get guidelines
    let guidelinesRes = await pool.query(guidelinesSQLText, [req.params.catId, req.params.ageId]);

    //Get questions to ask your doctor
    let drQuestionsRes = await pool.query(drQuestionsSQLText, [req.params.catId, req.params.ageId]);

    let apiRes = {
        faqs: faqRes.rows,
        diagTools: diagRes.rows,
        guidelines: guidelinesRes.rows,
        drQuestions: drQuestionsRes.rows,
    }
    res.send(apiRes);

    }catch (err) {
        console.log('Error with fetching category details', err);
        res.sendStatus(500);
    }
})

router.get('/:catId/ages/:ageId/:sectionName', rejectUnauthenticated, async (req, res) => {
  console.log('in preventativecare specific Id router');

  const sectionName = req.params.sectionName;

  let sqlParams = [req.params.catId, req.params.ageId];
  let sqlText = '';

  switch(sectionName) {
    case 'Guidelines': 
      sqlText = `SELECT "id", "name" AS "field01", "info" AS "field02", 
        "grade" AS "field03", "date" AS "field04" 
        FROM "guidelines"
        WHERE "health_category_id" = $1 AND "age_range_id"=$2;`;
      break;
    case 'Diagnostic Tools':
      sqlText = `SELECT "id", "name" AS "field01", "info" AS "field02" 
        FROM "diagnostic_tool"
        WHERE "health_category_id" = $1 AND "age_range_id"=$2;`;
      break;
    case 'FAQ':
      sqlText = `
        SELECT "id", "question" AS "field01", "answer" AS "field02" 
        FROM "faq"
        WHERE "health_category_id" = $1 AND "age_range_id"=$2;`;
      break;
    case 'Questions for Your Doctor':
      sqlText = `SELECT "id", "answer" AS "field01", "question" AS "field02"
        FROM "doctor_questions"
        WHERE "health_category_id" = $1 AND "age_range_id"=$2;`;
      break;
  }


  // Get category details
  try{

  //Get guidelines
  let dbRes = await pool.query(sqlText, sqlParams);

  res.send(dbRes.rows);

  }catch (err) {
      console.log('Error with fetching category details', err);
      res.sendStatus(500);
  }
})

module.exports = router;

