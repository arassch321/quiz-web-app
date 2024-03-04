

const Input = ({ props }) => {
    const { label, type, placeholder, value, name, id, className } = props;

    return (
        <div className="">
            <label htmlFor={id} className="">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                name={name}
                id={id}
                className={className}
            />
        </div>
    );
}

export default Input;