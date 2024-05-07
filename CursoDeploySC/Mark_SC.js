const { Client, ContractCreateTransaction, FileCreateTransaction, Hbar, PrivateKey } = require("@hashgraph/sdk");
const fs = require("fs");

async function deployContract(){
    const client = Client.forTestnet();

    //Datos de la propia HBAR ACCOUNT!
    const accountId = "0.0.1317";
    const PrivateKeyHex = "0x6e4485979cfda4a74cd92fea21c38e7f7c833caa32a82ea0e689e9e947d961a3";
    const privateKey = PrivateKey.fromStringED25519(PrivateKeyHex) //<-- Escoger la encriptación correcta :)

    client.setOperator(accountId, privateKey);

    const bytecode = fs.readFileSync("SmartContract.bin");

    const fileCreateTx = new FileCreateTransaction()
        .setContents(bytecode)
        .setMaxTransactionFee(new Hbar(10)); // Ajusta la tarifa de transacción según sea necesario
    const submitFileCreateTx = await fileCreateTx.execute(client);
    const fileCreateRx = await submitFileCreateTx.getReceipt(client);
    const bytecodeFileId = fileCreateRx.fileId;

    const contractInstantiateTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(100000) // Ajusta el gas según sea necesario
        .setMaxTransactionFee(new Hbar(10)); // Ajusta la tarifa de transacción según sea necesario
    const submitInstantiateTx = await contractInstantiateTx.execute(client);
    const contractInstantiateRx = await submitInstantiateTx.getReceipt(client);
    const contractId = contractInstantiateRx.contractId;

    console.log(`Contrato se ha desplegado correctamente en el ID: ${contractId}`);

    //Finalizamos el proceso
    process.exit(0);
}

deployContract().catch(error => {
    console.error("Error al desplegar el código:" , error);
    process.exit(1); //Salida por error
})