import AccountRepository from "../repositories/account.repository.js";

async function save(account) {
  return await AccountRepository.save(account);
}

async function all() {
  return await AccountRepository.all();
}

async function byId(id) {
  return await AccountRepository.byId(id);
}

async function remove(id) {
  return await AccountRepository.remove(id);
}

async function update(account, id) {
  return await AccountRepository.update(account, id);
}

async function updateBalance(balance, id) {
  return await AccountRepository.updateBalance(balance, id);
}

export default {
  save,
  all,
  byId,
  remove,
  update,
  updateBalance,
};
