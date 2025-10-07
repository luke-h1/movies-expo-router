import * as AC from "@bacons/apple-colors";
import {
  createNavigatorFactory,
  DefaultRouterOptions,
  ParamListBase,
  StackNavigationState,
  StackRouter,
  useNavigationBuilder,
} from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  NativeStackView,
} from "@react-navigation/native-stack";
import { withLayoutContext } from "expo-router";
import { ReactNode } from "react";
import { Platform } from "react-native";
import { Drawer } from "vaul";
import modalStyles from "./modal.module.css";

/**
 * Extend NativeStackNavigationOptions with extra sheet/detent props
 * taken from @see https://github.com/EvanBacon/expo-rsc-movies/blob/main/components/layout/modalNavigator.web.tsx
 */

type MyModalStackNavigationOptions = NativeStackNavigationOptions & {
  presentation?:
    | "modal"
    | "formSheet"
    | "containedModal"
    | "card"
    | "fullScreenModal";
  /**
   * If you want to mimic iOS sheet detents on native (iOS 16+ w/ react-native-screens),
   * you might do something like:
   *
   * supportedOrientations?: string[];
   * sheetAllowedDetents?: Array<number>;
   * sheetInitialDetentIndex?: number;
   *
   * But here we specifically pass them for the web side via vaul:
   */
  sheetAllowedDetents?: (number | string)[]; // e.g. [0.5, 1.0] or ['148px', '355px', 1]
  sheetInitialDetentIndex?: number; // which index in `sheetAllowedDetents` is the default
  sheetGrabberVisible?: boolean;
};

type MyModalStackRouterOptions = DefaultRouterOptions & {
  // Extend if you need custom router logic
};

interface Props {
  initialRouteName?: string;
  screenOptions?: MyModalStackNavigationOptions;
  children: ReactNode;
}

function MyModalStackNavigator({
  children,
  initialRouteName,
  screenOptions,
}: Props) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      // @ts-expect-error - got 3 expected 5 type args but its fine
      StackNavigationState<ParamListBase>,
      MyModalStackRouterOptions,
      MyModalStackNavigationOptions
    >(StackRouter, {
      children,
      screenOptions,
      initialRouteName,
    });

  return (
    <NavigationContent>
      <MyModalStackView
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

/**
 * Filters out "modal"/"formSheet" routes from the normal <NativeStackView> on web,
 * rendering them in a vaul <Drawer> with snap points. On native, we just let
 * React Navigation handle the sheet or modal transitions.
 */
function MyModalStackView({
  descriptors,
  navigation,
  state,
}: {
  state: StackNavigationState<ParamListBase>;
  navigation: any;
  descriptors: Record<
    string,
    {
      options: MyModalStackNavigationOptions;
      render: () => React.ReactNode;
    }
  >;
}) {
  const isWeb = Platform.OS === "web";

  /**
   * Filter out any route that wants to be shown as a modal on web
   */
  const nonModalRoutes = state.routes.filter((route) => {
    const descriptor = descriptors[route.key];
    const { presentation } = descriptor.options || {};
    const isModalType =
      presentation === "modal" ||
      presentation === "formSheet" ||
      presentation === "fullScreenModal" ||
      presentation === "containedModal";
    return !(isWeb && isModalType);
  });

  /**
   * Recalculate index so we don't point to a missing route on web
   */
  let nonModalIndex = nonModalRoutes.findIndex(
    (r) => r.key === state.routes[state.index]?.key
  );
  if (nonModalIndex < 0) {
    nonModalIndex = nonModalRoutes.length - 1;
  }

  const newStackState: StackNavigationState<ParamListBase> = {
    ...state,
    routes: nonModalRoutes,
    index: nonModalIndex,
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Normal stack rendering for native & non-modal routes on web */}
      <NativeStackView
        state={newStackState}
        navigation={navigation}
        // @ts-expect-error
        descriptors={descriptors}
      />

      {/* Render vaul Drawer for active "modal" route on web, with snap points */}
      {isWeb &&
        state.routes.map((route, i) => {
          const descriptor = descriptors[route.key];

          const { presentation, sheetAllowedDetents, sheetGrabberVisible } =
            descriptor.options || {};

          const isModalType =
            presentation === "modal" ||
            presentation === "formSheet" ||
            presentation === "fullScreenModal" ||
            presentation === "containedModal";

          const isActive = i === state.index && isModalType;

          if (!isActive) {
            return null;
          }

          /**
           * Convert numeric detents (e.g. 0.5 => "50%") to a string
           * if user passes pixel or percentage strings, we'll keep them as is
           */
          const rawDetents = sheetAllowedDetents || [1];

          return (
            <Drawer.Root
              key={route.key}
              open
              fadeFromIndex={0}
              /**
               * Provide snap points to vaul
               */
              snapPoints={rawDetents}
              /**
               * For a 'sheet' style, might want to scale background slightly
               */
              shouldScaleBackground={presentation !== "formSheet"}
              onOpenChange={(open) => {
                if (!open) {
                  navigation.goBack();
                }
              }}
            >
              <Drawer.Portal>
                <Drawer.Overlay
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.4)",
                  }}
                />
                <Drawer.Content
                  className={modalStyles.drawerContent}
                  style={{
                    pointerEvents: "none",
                  }}
                >
                  <div className={modalStyles.modal}>
                    {/* optional grabber */}

                    {sheetGrabberVisible && (
                      <div
                        style={{
                          padding: 16,
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            AC.systemGroupedBackground as unknown as string,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: AC.separator as unknown as string,
                          }}
                        />
                      </div>
                    )}

                    {/* render the actual screen */}
                    {descriptor.render()}
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          );
        })}
    </div>
  );
}

const createMyModalStack = createNavigatorFactory(MyModalStackNavigator);

/**
 * If you're using Expo Router, wrap with `withLayoutContext`.
 * Otherwise, just export the createMyModalStack().Navigator as usual.
 */
const RouterModal = withLayoutContext(createMyModalStack().Navigator);

export default RouterModal;
