const core = require("@actions/core");
const exec = require("@actions/exec");
const path = require("path");

const repo_url    : string = "https://github.com/alire-project/alire.git";
const repo_branch : string = "master";
const alire_src   : string = core.getInput('destination');

async function run() {
   console.log("Starting setup-alire@exp v0.0.1...");

   try {
       await exec.exec(`git clone --recurse-submodules -b ${repo_branch} ${repo_url} ${alire_src}`);

       process.chdir(alire_src);

       if (process.platform == "darwin") {
           process.env.OS = "macOS"
       }

       await exec.exec(`gprbuild -j0 -p -XSELFBUILD=False -P alr_env.gpr -cargs -fPIC`);
       
       core.addPath(path.join(process.cwd(), 'bin'));
   }
   catch (error) {
       core.setFailed(error.message);
   }
}

run();
