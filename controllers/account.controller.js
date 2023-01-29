import AccountService from "../services/account.service.js";

async function save(req, res, next) {
  try {
    let account = req.body;
    if (!account.name || account.balance == null) {
      throw new Error("Filds 'name' and 'balance' are mandatorie.");
    }
    account = await AccountService.save(account);
    logger.info(`POST /account - ${JSON.stringify(account)}`);
    res.send(account);
  } catch (err) {
    next(err);
  }
}

async function all(req, res, next) {
  try {
    logger.info("GET /account");
    res.send(await AccountService.all());
  } catch (err) {
    next(err);
  }
}

async function byId(req, res, next) {
  try {
    logger.info("GET /account/:id");
    res.send(await AccountService.byId(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await AccountService.remove(req.params.id);
    logger.info(`DELETE /account/:id - ${req.params.id}`);
    res.send({ deleted: true });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const account = req.body;
    if (!account.name || account.balance == null) {
      throw new Error("Filds 'name' and 'balance' are mandatorie.");
    }
    logger.info("UPDATE /account/:id");
    res.send(await AccountService.update(account, req.params.id));
  } catch (err) {
    next(err);
  }
}

async function updateBalance(req, res, next) {
  try {
    const account = req.body;
    if (account.balance == null) {
      throw new Error("Fild 'balance' is mandatorie.");
    }
    logger.info(`PUT /account - ${JSON.stringify(account)}`);
    res.send(
      await AccountService.updateBalance(account.balance, req.params.id)
    );
  } catch (err) {
    next(err);
  }
}

export default {
  save,
  all,
  byId,
  remove,
  update,
  updateBalance,
};
