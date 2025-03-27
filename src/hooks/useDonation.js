import { useState } from 'react';

export function useDonation(ethAddress) {
    const [donationStatus, setDonationStatus] = useState('');

    // Función para manejar la donación
    const handleDonation = async () => {
        // Verifica si MetaMask está instalado
        if (typeof window.ethereum !== 'undefined') {
            try {
                setDonationStatus('connecting');

                // Solicita acceso a la cuenta
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                if (accounts.length === 0) {
                    setDonationStatus('cancelled');
                    setTimeout(() => setDonationStatus(''), 3000);
                    return;
                }

                // Configura la transacción
                const transactionParameters = {
                    to: ethAddress, // Dirección ETH
                    from: accounts[0], // Dirección del usuario
                    value: '0x' + (0.0001 * 1e18).toString(16), // 0.01 ETH en hex
                };

                // Envía la transacción
                setDonationStatus('pending');

                try {
                    const txHash = await window.ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });

                    setDonationStatus('success');
                } catch (txError) {
                    // Específicamente capturamos errores de la transacción
                    // Código 4001 = Usuario rechazó la transacción en MetaMask
                    if (txError.code === 4001) {
                        setDonationStatus('cancelled');
                    } else {
                        console.error('Error en la transacción:', txError.message || 'Error desconocido');
                        setDonationStatus('error');
                    }
                }

                // Reset después de 3 segundos
                setTimeout(() => {
                    setDonationStatus('');
                }, 3000);

            } catch (error) {
                // Este bloque captura errores generales (como conectar con MetaMask)
                const errorMessage = error.message || 'Error desconocido';

                // Verificamos si el error es de usuario cancelando
                if (error.code === 4001 || errorMessage.includes('User rejected')) {
                    setDonationStatus('cancelled');
                } else {
                    console.error('Error al interactuar con MetaMask:', errorMessage);
                    setDonationStatus('error');
                }

                // Reset después de 3 segundos
                setTimeout(() => {
                    setDonationStatus('');
                }, 3000);
            }
        } else {
            // Si MetaMask no está instalado, copiamos la dirección al portapapeles
            try {
                await navigator.clipboard.writeText(ethAddress);
                setDonationStatus('copied');
            } catch (clipboardError) {
                console.error('Error al copiar al portapapeles:', clipboardError);
                setDonationStatus('error');
            }

            // Reset después de 3 segundos
            setTimeout(() => {
                setDonationStatus('');
            }, 3000);
        }
    };

    // Determina el texto del status según el estado actual
    const getStatusText = () => {
        switch (donationStatus) {
            case 'connecting': return 'Conectando...';
            case 'pending': return 'Enviando...';
            case 'success': return '¡Gracias por tu donación!';
            case 'error': return 'Error al procesar';
            case 'copied': return '¡Dirección copiada!';
            case 'cancelled': return 'Operación cancelada';
            default: return 'Click para donar ETH';
        }
    };

    return {
        donationStatus,
        handleDonation,
        getStatusText
    };
}
