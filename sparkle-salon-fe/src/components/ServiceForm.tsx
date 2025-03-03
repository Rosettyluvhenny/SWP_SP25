const ServiceInfoForm = ({
    handleCloseServiceForm,
}: {
    handleCloseServiceForm: () => void;
}) => {
    return (
        <div>
            <h1>Create Service</h1>
            <button onClick={handleCloseServiceForm}>Close</button>
            <button onClick={handleCloseServiceForm}>Save</button>
        </div>
    );
};

export default ServiceInfoForm;
