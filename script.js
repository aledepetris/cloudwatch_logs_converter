document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        document.getElementById('processBtn').disabled = false;
    }
});

document.getElementById('processBtn').addEventListener('click', function () {
    const file = document.getElementById('fileInput').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                const logsDictionary = {};

                jsonData.forEach(obj => {
                    const podId = obj['@message'].kubernetes.pod_id;
                    const log = obj['@message'].log;

                    if (!logsDictionary[podId]) {
                        logsDictionary[podId] = [];
                    }
                    logsDictionary[podId].push(log);
                });

                const output = document.getElementById('output');
                output.innerHTML = '';

                Object.keys(logsDictionary).forEach(podId => {
                    const blob = new Blob([logsDictionary[podId].join('\n')], { type: 'text/plain' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `logs-${podId}.txt`;
                    link.textContent = `Descargar logs-${podId}.txt`;
                    output.appendChild(link);
                    output.appendChild(document.createElement('br'));
                });
            } catch (error) {
                console.error("Error al procesar el archivo JSON:", error);
                alert("Error al procesar el archivo JSON. Asegúrate de que el archivo es válido.");
            }
        };
        reader.readAsText(file);
    }
});
