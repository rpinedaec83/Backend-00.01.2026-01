

const Heladeria = function(){
    console.log("Inicio de la aplicacion");
    let Nombre, Sucursal;

    function configurar(){
        document.getElementById("txtNombre").innerText = Nombre;
        $("#txtSucursal").text(Sucursal);
    }
    function eventos(){
        // document.getElementById('btnOrdenar').addEventListener("click",()=>{
        //     console.log("Hizo clic")
        // })
        $("#btnOrdenar").on("click",ordenar);
    }

    function ordenar(e){
        console.log("Hizo clic")
    }

    return{
        init: function(parametros){
            console.log(parametros);
            Nombre = parametros.nombre;
            Sucursal = parametros.sucursal;
            configurar();
            eventos();
        }
    }
}();