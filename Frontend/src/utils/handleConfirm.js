export const handleConfirm = async () => {
    try {
        setLoading(true);

        await confirmConfig.action?.();

        setConfirmOpen(false);
    } catch (error) {
        toastError("Thao tác thất bại", getErrorMessage(error));
    } finally {
        setLoading(false);
    }
};