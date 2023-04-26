export default async function ({ redirect, store }) {
    if (!store.getters.isAdmin) {
        redirect('/dashboard');
    }
}
