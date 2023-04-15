export class Favorites {
  constructor(rota) {
    this.rota = document.querySelector(rota);
    // console.log(this.rota);
    this.load();

    githubUser.search("tiagolaurentino").then((usuario) => console.log(usuario)); 
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:  ")) || [];
    console.log(this.entries);
  }

  salve() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

 async add(username) {
    try{
        const usuarioExiste = this.entries.find((entry) => entry.login === username);

        if(usuarioExiste) {
            throw new Error('Usuário já encontrado!!')
        }

        const usuario = await githubUser.search(username)

        if(usuario.login === undefined) {
            throw new Error("Usuario não encontrado")
        } 

        this.entries = [usuario, ...this.entries];

        this.dados()
        this.salve()
    } catch (error) {
        alert(error.message);
    }
  }

  delete(usuario) {

    /* const filtro = this.entries.filter(entry => {
      return false
    })  
    console.log(filtro)  */
    
    const filtro = this.entries.filter(
      (entry) => entry.login !== usuario.login
     // console.log(entry)
     
    );

    this.entries = filtro;

    this.dados();
    this.salve();
  }
}

export class FavoritesView extends Favorites {
  constructor(rota) {
    super(rota);

    this.tbody = this.rota.querySelector("table tbody");

    this.dados();
    this.adicionar();
  }

  adicionar() {
    const addBotao = this.rota.querySelector(".comandos button");
    addBotao.onclick = () => {
      const { value } = this.rota.querySelector(".comandos input");

      this.add(value);
    };
  }

  dados() {
    this.removeTodostr();

    this.entries.forEach((usuario) => {
      // console.log(usuario)

      const linha = this.criarLinha();
      //console.log(linha)

      linha.querySelector(
        ".usuario img"
      ).src = `https://github.com/${usuario.login}.png`;
      linha.querySelector(".usuario img").alt = `imagem de ${usuario.name}`;
      linha.querySelector(
        ".usuario a"
      ).href = `https://github.com/${usuario.login}`;
      linha.querySelector(".usuario p").textContent = usuario.name;
      linha.querySelector(".usuario span").textContent = usuario.login;
      linha.querySelector(".repositorio").textContent = usuario.public_repos;
      linha.querySelector(".favorite").textContent = usuario.followers;

     linha.querySelector("button.remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha!!");
        if (isOk) {
          this.delete(usuario);
        }
      };

    /*  linha.querySelector("button.remove").addEventListener('click', function() {
        const isOk = confirm("Tem certeza que deseja deletar essa linha!!");
        if (isOk) {
          this.delete(usuario);
        }
       });*/

      this.tbody.append(linha);
    });
  }

  criarLinha() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    
    <td class="usuario">
      <img
        src="https://github.com/tiagolaurentino.png"
        alt="imagem de tiagoLaurentino"
      />
      <a href="https://github.com/tiagolaurentino" target="_blank">
        <p>Tiago Laurentino</p>
        <span>/tiagolauren</span>
      </a>
    </td>
    <td class="repositorio">25</td>
    <td class="favorite">10</td>
    <td>
      <button class="remove">remover</button>
    </td>
 
  `;
    return tr;
  }

  removeTodostr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}


class githubUser {
  static search(username) {
    const endpointer = `https://api.github.com/users/${username}`;

    return fetch(endpointer).then((data) => data.json())
    .then(({login, name, public_repos, followers}) => 
    
    ({
        login,
        name,
        public_repos,
        followers
    }));
  }
}

new FavoritesView("#app");
