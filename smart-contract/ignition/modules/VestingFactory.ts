import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const VestingFactoryModule =
    buildModule(
        "VestingFactoryModule",
        (mod) => {

            const vestingFactory = mod.contract("VestingFactory");

            return {vestingFactory};
        });

export default VestingFactoryModule;
