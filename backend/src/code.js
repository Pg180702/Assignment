function createMongoDBQuery(reqBody) {
  const initialRule = reqBody.initialRule;
  const conditions = reqBody.conditions;
  const operatorMap = {
    ">": "$gt",
    "<": "$lt",
    "=": "$eq",
  };
  const isDateField = (attribute) => {
    const dateFields = ["last_visited"];
    return dateFields.includes(attribute);
  };
  const parseValue = (attribute, value) => {
    if (isDateField(attribute)) {
      return new Date(value);
    } else {
      return parseFloat(value);
    }
  };
  const initialQuery = {
    [initialRule.attribute]: {
      [operatorMap[initialRule.operator]]: parseValue(
        initialRule.attribute,
        initialRule.value
      ),
    },
  };
  let query = [initialQuery];
  conditions.forEach((condition) => {
    const conditionQuery = {
      [condition.attribute]: {
        [operatorMap[condition.operator]]: parseValue(
          condition.attribute,
          condition.value
        ),
      },
    };
    if (condition.logic === "AND") {
      query = [{ $and: [query[0], conditionQuery] }];
    } else if (condition.logic === "OR") {
      query = [{ $or: [query[0], conditionQuery] }];
    }
  });
  const finalQuery = query[0] || {};
  return finalQuery;
}

function buildQuery(req) {
  const reqBody = req.body;
  // const reqBody = {
  //   initialRule: { attribute: "total_spend", operator: ">", value: "10000" },
  //   conditions: [
  //     { attribute: "no_of_visits", operator: "<", value: "3", logic: "AND" },
  //     {
  //       attribute: "last_visited",
  //       operator: ">",
  //       value: "2024-06-01",
  //       logic: "OR",
  //     },
  //     { attribute: "no_of_visits", operator: ">", value: "1", logic: "AND" },
  //   ],
  // };
  const query = createMongoDBQuery(reqBody);
  const filterQuery = JSON.stringify(query, null, 2);
  return filterQuery;
  //console.log(filterQuery);
}
const req = {};
req.body = {
  initialRule: { attribute: "total_spend", operator: ">", value: "10000" },
  conditions: [
    { attribute: "no_of_visits", operator: "<", value: "3", logic: "AND" },
    {
      attribute: "last_visited",
      operator: ">",
      value: "2024-06-01",
      logic: "OR",
    },
    { attribute: "no_of_visits", operator: ">", value: "1", logic: "AND" },
  ],
};
const filterQuery = buildQuery(req);
console.log(filterQuery);
