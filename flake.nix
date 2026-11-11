{
  description = "EduVereda - Entorno seguro y reproducible (React Native + Expo Web + pnpm)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          name = "eduvereda-react-native-env";

          buildInputs = with pkgs; [
            # Runtime y gestor de paquetes exclusivo (pnpm) para React Native / Expo
            nodejs_22
            pnpm
            typescript
            typescript-language-server

            # Herramientas de monitoreo de archivos, base de datos local y criptografía
            watchman
            sqlite
            openssl

            # Utilidades de desarrollo y auditoría JSON
            git
            jq
          ];

          env = {
            # Privacidad y seguridad: desactiva telemetría externa y analíticas
            EXPO_NO_TELEMETRY = "1";
            DO_NOT_TRACK = "1";
            BROWSER = "none";
          };

          shellHook = ''
            # Asegura que .npmrc tenga node-linker=hoisted para compatibilidad de pnpm con Expo/Metro
            if [ ! -f .npmrc ]; then
              cat << 'EOF' > .npmrc
node-linker=hoisted
strict-peer-dependencies=false
auto-install-peers=true
EOF
            fi

            echo "======================================================================"
            echo "🌱 Entorno Seguro EduVereda (React Native + Expo Web + pnpm) activo"
            echo "======================================================================"
            echo "Node: $(node --version) | pnpm: $(pnpm --version) | SQLite: $(sqlite3 --version | cut -d' ' -f1)"
            echo "Seguridad: Telemetría desactivada (EXPO_NO_TELEMETRY=1, DO_NOT_TRACK=1)"
            echo ""
            echo "Comandos con pnpm para el proyecto:"
            echo "  • Instalar dependencias : pnpm install"
            echo "  • Iniciar Demo Web      : pnpm expo start --web"
            echo "  • Exportar PWA Offline  : pnpm expo export --platform web"
            echo "======================================================================"
          '';
        };
      }
    );
}
