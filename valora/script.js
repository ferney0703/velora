const botonAnillo = document.getElementById("anillo");
const botonManilla = document.getElementById("manilla");
const opciones = document.getElementById("opciones");


// ==============================
// MOSTRAR ANILLOS
// ==============================

botonAnillo.addEventListener("click", function () {

    opciones.innerHTML = `

        <div class="opcion-card">

            <div class="producto-imagen">
                💍
            </div>

            <h3>Moderno</h3>

            <p>
                Diseños elegantes y actuales
                para un estilo sofisticado.
            </p>

        </div>


        <div class="opcion-card">

            <div class="producto-imagen">
                💍
            </div>

            <h3>Casual</h3>

            <p>
                Diseños sencillos y versátiles
                para usar todos los días.
            </p>

        </div>

    `;

});


// ==============================
// MOSTRAR MANILLAS
// ==============================

botonManilla.addEventListener("click", function () {

    opciones.innerHTML = `

        <div class="opcion-card">

            <div class="producto-imagen">
                ✨
            </div>

            <h3>Silicona</h3>

            <p>
                Cómoda, ligera y perfecta
                para un estilo moderno.
            </p>

        </div>


        <div class="opcion-card">

            <div class="producto-imagen">
                ✨
            </div>

            <h3>Acero</h3>

            <p>
                Un acabado elegante y
                resistente.
            </p>

        </div>


        <div class="opcion-card">

            <div class="producto-imagen">
                ✨
            </div>

            <h3>Cuero</h3>

            <p>
                Un estilo clásico con
                personalidad.
            </p>

        </div>

    `;

});