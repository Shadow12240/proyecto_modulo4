function validate(schema, target="body") {
    return (req, res, next) => {
        const data = req[target];
    

        //paso 1 verificar haya datos
        if(!data || Object.keys(data).length === 0) {
        return res.status(400).json({ message: "No data found" });
    }
        //paso 2 validar datos
        const { error,value } = schema.validate(data, { 
            abortEarly: false,
            stripUnknown: true,
        })
        //paso 3 si hay error de validacion retornar error 400
        if(error) {
            return res.status(400).json({
                message: `error de validacion en ${target}`,
                errores: error.details.map(err => err.message)
            })
    }
    //paso 4 reemplazar el objeto original por datos limpios
    req[target] = value;

    //continuamos.....
    next();
    }
}

export default validate