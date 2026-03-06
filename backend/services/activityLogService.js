const { ActivityLog } = require("../models");

exports.createLog = async ({
  action,
  entity,
  entityId,
  performedBy,
}) => {
  await ActivityLog.create({
    action,
    entity,
    entityId,
    performedBy,
  });
};