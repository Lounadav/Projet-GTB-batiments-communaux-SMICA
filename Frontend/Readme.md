# Louna Le Bot--Davoust : Interface Frontend

## Missions
* Conception des maquettes pour les profils Admin, Responsable et Élu.
* Développement des interfaces web en HTML, CSS et JavaScript.
* Mise en œuvre de la responsivité pour une consultation sur tablette/mobile.
* Intégration dynamique des données via des appels API au backend.

## Stack Technique
- Langages : HTML5, CSS3, JavaScript.
- IDE : Visual Studio Code.

``` mermaid graph LR
    flowchart LR
    %% --- CONFIGURATION GLOBALE ---
    %% Lissage des courbes pour un rendu plus organique
    linkStyle default interpolation basis
    
    %% --- PALETTE DE COULEURS & STYLES ---
    %% Style des Acteurs (Rond + Icône)
    classDef actorAdmin fill:#2d3e50,stroke:#2d3e50,color:#fff,stroke-width:2px;
    classDef actorResp fill:#0277bd,stroke:#0277bd,color:#fff,stroke-width:2px;
    classDef actorUser fill:#009688,stroke:#009688,color:#fff,stroke-width:2px;
    classDef actorSystem fill:#e0e0e0,stroke:#9e9e9e,color:#333,stroke-dasharray: 5 5;

    %% Style des Cas d'utilisation (Arrondis et clairs)
    classDef ucAdmin fill:#eceff1,stroke:#b0bec5,color:#37474f,stroke-width:2px,rx:10,ry:10;
    classDef ucResp fill:#e1f5fe,stroke:#81d4fa,color:#01579b,stroke-width:2px,rx:10,ry:10;
    classDef ucUser fill:#e0f2f1,stroke:#80cbc4,color:#00695c,stroke-width:2px,rx:10,ry:10;

    %% Style des Conteneurs (Subgraphs)
    classDef subGraphContainer fill:#fff,stroke:#ddd,stroke-width:1px,color:#999,stroke-dasharray: 5 5;

    %% --- ACTEURS (À Gauche) ---
    %% Utilisation de codes "fa" pour les icônes si supporté par votre éditeur
    Admin(fa:fa-user-cog Agent SMICA):::actorAdmin
    Resp(fa:fa-user-tie Resp. Mairie):::actorResp
    User(fa:fa-users Élu / Public):::actorUser

    %% --- SYSTÈME FRONTEND (Au Centre) ---
    subgraph Frontend [Application Web]
        direction TB
        
        %% Zone Admin
        subgraph G_Admin [Administration]
            UC_Config([fa:fa-tools Configurer Bâtiments<br/>& Capteurs]):::ucAdmin
            UC_List([fa:fa-list Lister l'inventaire]):::ucAdmin
        end

        %% Zone Responsable
        subgraph G_Resp [Gestion Bâtiment]
            UC_Heat([fa:fa-fire Commander<br/>Chauffage]):::ucResp
            UC_ViewResp([fa:fa-chart-line Visualiser<br/>Temps Réel]):::ucResp
        end

        %% Zone Public
        subgraph G_User [Consultation]
            UC_ViewGlob([fa:fa-globe Vue Globale<br/>Températures]):::ucUser
        end
    end

    %% --- BACKEND (À Droite) ---
    API(fa:fa-server API / Backend<br/>JSON):::actorSystem

    %% --- FLUX D'INTERACTIONS ---
    
    %% Flux Admin
    Admin --> UC_Config
    Admin --> UC_List
    UC_Config -.->|POST / Config| API
    UC_List -.->|GET / List| API

    %% Flux Responsable
    Resp --> UC_Heat
    Resp --> UC_ViewResp
    UC_Heat -.->|POST / Command| API
    API -.->|GET / Data| UC_ViewResp

    %% Flux Utilisateur
    User --> UC_ViewGlob
    API -.->|GET / Data| UC_ViewGlob

    %% Application du style aux sous-graphes
    class Frontend,G_Admin,G_Resp,G_User subGraphContainer
```

```mermaid graph LR
flowchart TD

    %% --- STYLES ---
    linkStyle default interpolation basis
    
    %% Style des blocs Exigences (Imitation SysML Header + Text)
    classDef mainReq fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1;
    classDef subReq fill:#fff,stroke:#1e88e5,stroke-width:1px,color:#000,stroke-dasharray: 0;
    classDef techReq fill:#f1f8e9,stroke:#558b2f,stroke-width:1px,color:#33691e;

    %% --- EXIGENCE PRINCIPALE (Source: 119, 121) ---
    ReqMain("<b>«requirement»</b><br/>Interface Frontend<br/>ID: 4<br/>---<br/><i>Développer une interface ergonomique<br/>pour suivre et commander les éléments<br/>des bâtiments (Admin/Resp/Élu).</i>"):::mainReq

    %% --- SOUS-EXIGENCES FONCTIONNELLES (Source: 163-178) ---
    subgraph Functional [Exigences Fonctionnelles]
        direction TB
        
        ReqAdmin("<b>«functional»</b><br/>Gestion Administration<br/>ID: 4.1<br/>---<br/><i>Permettre l'ajout et la config<br/>des bâtiments et capteurs via formulaires.</i>"):::subReq
        
        ReqResp("<b>«functional»</b><br/>Pilotage Responsable<br/>ID: 4.2<br/>---<br/><i>Visualiser T° d'un bâtiment<br/>et piloter le chauffage (ON/OFF/Consigne).</i>"):::subReq
        
        ReqUser("<b>«functional»</b><br/>Consultation Public<br/>ID: 4.3<br/>---<br/><i>Affichage simple des températures<br/>globales de l'ensemble des bâtiments.</i>"):::subReq
    end

    %% --- CONTRAINTES TECHNIQUES (Source: 166, 179, 184) ---
    subgraph Technical [Contraintes Techniques]
        direction TB
        
        ReqRespDesign("<b>«constraint»</b><br/>Responsivité<br/>ID: 4.4<br/>---<br/><i>L'interface doit s'adapter<br/>aux écrans (Mobile/Desktop).</i>"):::techReq
        
        ReqStack("<b>«constraint»</b><br/>Stack Technique<br/>ID: 4.5<br/>---<br/><i>HTML5, CSS3, JavaScript.<br/>IDE: Visual Studio Code.</i>"):::techReq

        ReqAPI("<b>«interface»</b><br/>Connexion API<br/>ID: 4.6<br/>---<br/><i>Récupération dynamique (JS)<br/>des données via l'API Backend.</i>"):::techReq
    end

    %% --- RELATIONS (Traceability) ---
    
    %% Décomposition (Containment)
    ReqMain -->|«derive»| ReqAdmin
    ReqMain -->|«derive»| ReqResp
    ReqMain -->|«derive»| ReqUser

    %% Raffinement technique
    ReqMain -.-|«refine»| ReqRespDesign
    ReqMain -.-|«refine»| ReqStack
    ReqMain -.-|«refine»| ReqAPI

    %% Application des styles
    class ReqAdmin,ReqResp,ReqUser subReq
    class ReqRespDesign,ReqStack,ReqAPI techReq
```